
using Flurl;
using Flurl.Http;
using HSE.MOR.API.Models.Notifications;
using Microsoft.Extensions.Options;
using System.Net;

namespace HSE.MOR.API.Services;

public class OTPService
{
    private readonly IntegrationsOptions integrationsOptions;

    public OTPService(IOptions<IntegrationsOptions> integrationsOptions)
    {
        this.integrationsOptions = integrationsOptions.Value;
    }

    public async Task<string> GenerateToken(string secretKey)
    {
        var response = await integrationsOptions.CommonAPIEndpoint
            .AppendPathSegments("api", "GenerateToken")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .PostJsonAsync(new
            {
                TokenData = secretKey
            })
            .ReceiveJson<TokenResponse>();

        return response.Token;
    }

    public async Task<bool> ValidateToken(string otpToken, string secretKey, bool forceLowerCase = true)
    {
        var response = await integrationsOptions.CommonAPIEndpoint
            .AppendPathSegments("api", "ValidateToken")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .AllowAnyHttpStatus()
            .PostJsonAsync(new
            {
                Token = otpToken,
                TokenData = secretKey
            });

        return response.StatusCode == (int)HttpStatusCode.OK;
    }

    public async Task SendNotificationEmail(string emailAddress, string otpToken)
    {

        var response = await integrationsOptions.CommonAPIEndpoint
            .AppendPathSegment("api")
            .AppendPathSegment("SendNotificationEmail")
            .WithHeader("x-functions-key", integrationsOptions.CommonAPIKey)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .PostJsonAsync(new EmailNotificationRequest
            {
                email_address = emailAddress,
                template_id = integrationsOptions.NotificationServiceOTPEmailTemplateId,
                personalisation = new Dictionary<string, dynamic>()
                {
                        { "security code", otpToken },
                }
            });
    }
}

public record TokenResponse(string Token);