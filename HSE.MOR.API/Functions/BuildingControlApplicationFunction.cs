using HSE.MOR.API.Models;
using HSE.MOR.API.Services;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HSE.MOR.API.Extensions;

namespace HSE.MOR.API.Functions;

public class BuildingControlApplicationFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<BuildingControlApplicationFunction> logger;

    public BuildingControlApplicationFunction(IDynamicsService dynamicsService, ILogger<BuildingControlApplicationFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(GetDynamicsBuildingDetailsByBcaReferenceAsync))]
    public async Task<HttpResponseData> GetDynamicsBuildingDetailsByBcaReferenceAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(GetDynamicsBuildingDetailsByBcaReferenceAsync)}/{{bcaReferenceNumber}}")] HttpRequestData request, string bcaReferenceNumber)
    {
        var response = default(HttpResponseData);
        var returnBuildingDetailsList = new List<DynamicsBuildingDetails>();
        try
        {          
            var listBuildings = await dynamicsService.GetDynamicsBuildingDetailsUsingBcaReference_Async(bcaReferenceNumber);
            if (listBuildings != null || listBuildings?.Count > 0)
            {
                returnBuildingDetailsList.AddRange(listBuildings);
            }
            response = await BuildBuildingDetailsResponseObjectAsync(request, returnBuildingDetailsList.Distinct().ToList());

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(GetDynamicsBuildingDetailsByBcaReferenceAsync), ex);
            throw;
        }
        return response;
    }
    private async Task<HttpResponseData> BuildBuildingDetailsResponseObjectAsync(HttpRequestData request, List<DynamicsBuildingDetails> response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
