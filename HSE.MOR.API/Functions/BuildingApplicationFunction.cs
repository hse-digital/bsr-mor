
using HSE.MOR.API.Services;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using HSE.MOR.API.Extensions;

namespace HSE.MOR.API.Functions;

public class BuildingApplicationFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<BuildingApplicationFunction> logger;

    public BuildingApplicationFunction(IDynamicsService dynamicsService, ILogger<BuildingApplicationFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(GetDynamicsStructureByHrbrNumberAsync))]
    public async Task<HttpResponseData> GetDynamicsStructureByHrbrNumberAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetDynamicsStructureByHrbrNumberAsync)}/{{hrbrNumber}}")] HttpRequestData request, string hrbrNumber)
    {
        var response = default(HttpResponseData);
        var returnStructuresList = new List<DynamicsStructure>();
        try
        {
            var listBuildings = await dynamicsService.GetDynamicsStructureUsingHrbrNumber_Async(hrbrNumber);
            if (listBuildings != null || listBuildings?.Count > 0)
            {
                returnStructuresList.AddRange(listBuildings);
            }
            response = await StructureesponseObjectAsync(request, returnStructuresList.Distinct().ToList());

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(GetDynamicsStructureByHrbrNumberAsync), ex);
            throw;
        }
        return response;
    }
    private async Task<HttpResponseData> StructureesponseObjectAsync(HttpRequestData request, List<DynamicsStructure> response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
