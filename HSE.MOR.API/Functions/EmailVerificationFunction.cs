using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using System.Net;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Functions;

public class EmailVerificationFunction
{
    private readonly DynamicsService dynamicsService;
    private readonly OTPService otpService;

    public EmailVerificationFunction(DynamicsService dynamicsService, OTPService otpService)
    {
        this.dynamicsService = dynamicsService;
        this.otpService = otpService;
    }

    [Function(nameof(SendVerificationEmail))]
    public async Task<HttpResponseData> SendVerificationEmail([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var emailVerificationModel = await request.ReadAsJsonAsync<EmailVerificationModel>();
        var validation = emailVerificationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        var otpToken = await otpService.GenerateToken(emailVerificationModel.EmailAddress);

        await dynamicsService.SendVerificationEmail(emailVerificationModel.EmailAddress, otpToken);
        return request.CreateResponse();
    }

    public ValidationSummary ValidateKey(string key)
    {
        var errors = new List<string>();
        if (key != "e55cb4f7-5036-4fb9-b15b-102df960089f")
        {
            errors.Add("Invalid Test key");
        }

        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }


    [Function(nameof(GetOTPToken))]
    public async Task<HttpResponseData> GetOTPToken([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData request)
    {
        var keyValidation = ValidateKey(request.GetQueryParameters()["key"]);
        if (!keyValidation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(keyValidation);
        }

        var emailVerificationModel = new EmailVerificationModel(request.GetQueryParameters()["email"]);
        var validation = emailVerificationModel.Validate();
        if (!validation.IsValid)
        {
            return await request.BuildValidationErrorResponseDataAsync(validation);
        }

        var otpToken = await otpService.GenerateToken(emailVerificationModel.EmailAddress);

        return await request.CreateObjectResponseAsync(new { OTPCode = otpToken }) ;
    }

    [Function(nameof(ValidateOTPToken))]
    public async Task<HttpResponseData> ValidateOTPToken([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var otpValidationModel = await request.ReadAsJsonAsync<OTPValidationModel>();
        var returnStatusCode = HttpStatusCode.BadRequest;

        if (otpValidationModel.Validate().IsValid)
        {
            var tokenIsValid = await otpService.ValidateToken(otpValidationModel.OTPToken, otpValidationModel.EmailAddress);
            if (tokenIsValid)
            {
                returnStatusCode = HttpStatusCode.OK;
            }
        }

        return request.CreateResponse(returnStatusCode);
    }
}
