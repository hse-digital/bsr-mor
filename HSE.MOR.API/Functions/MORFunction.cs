using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Functions;

public class MORFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<BuildingApplicationFunction> logger;

    public MORFunction(IDynamicsService dynamicsService, ILogger<BuildingApplicationFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(NewMORCaseAsync))]
    public async Task<HttpResponseData> NewMORCaseAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request)
    {
        var response = default(HttpResponseData);
        try
        {
            var incidentModel = await request.ReadAsJsonAsync<IncidentModel>();

            var responseModel = await dynamicsService.CreateMORCase_Async(incidentModel);
            response = await request.CreateObjectResponseAsync(responseModel);

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(NewMORCaseAsync), ex);
            throw;
        }
        return response;

    }
}
