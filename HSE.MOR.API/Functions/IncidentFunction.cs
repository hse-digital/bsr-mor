using HSE.MOR.API.Services;
using HSE.MOR.API.Extensions;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Functions;

public class IncidentFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<IncidentFunction> logger;

    public IncidentFunction(IDynamicsService dynamicsService, ILogger<IncidentFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(GetIncidentUsingCaseNumberAsync))]
    public async Task<HttpResponseData> GetIncidentUsingCaseNumberAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(GetIncidentUsingCaseNumberAsync)}")] HttpRequestData request)
    {
        var response = default(HttpResponseData);

        try
        {
            var caseNumberVerificationModel = await request.ReadAsJsonAsync<CaseNumberValidationModel>();
            var validation = caseNumberVerificationModel.Validate();
            if (!validation.IsValid)
            {
                return await request.BuildValidationErrorResponseDataAsync(validation);
            }
            var incident = await dynamicsService.GetIncidentUsingCaseNumber_Async(caseNumberVerificationModel.CaseNumber);
            
            if (incident is not null)
            {

                response = await IncidentResponseObjectAsync(request, incident);
            }
            else
            {
                response = await IncidentResponseObjectAsync(request, new Incident());
            }

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(GetIncidentUsingCaseNumberAsync), ex);
            throw;
        }
        return response;
    }

    private async Task<HttpResponseData> IncidentResponseObjectAsync(HttpRequestData request, Incident response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
