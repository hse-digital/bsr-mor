using HSE.MOR.API.Services;
using HSE.MOR.API.Extensions;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Functions;

public class BuildingInformationFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<BuildingInformationFunction> logger;

    public BuildingInformationFunction(IDynamicsService dynamicsService, ILogger<BuildingInformationFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(GetBuildingInformationUsingPostcodeAsync))]
    public async Task<HttpResponseData> GetBuildingInformationUsingPostcodeAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = $"{nameof(GetBuildingInformationUsingPostcodeAsync)}")] HttpRequestData request)
    {
        var response = default(HttpResponseData);
        var returnBuildingInfoList = new List<DynamicsBuildingInformation>();

        try
        {
            var poscodeVerificationModel = await request.ReadAsJsonAsync<PostcodeValidationModel>();
            var validation = poscodeVerificationModel.Validate();
            if (!validation.IsValid)
            {
                return await request.BuildValidationErrorResponseDataAsync(validation);
            }
            var listBuildings = await dynamicsService.GetBuildingInformationUsingPostcode_Async(poscodeVerificationModel.Postcode);
            if (listBuildings != null || listBuildings?.Count > 0)
            {
                returnBuildingInfoList.AddRange(listBuildings);
            }
            response = await BuildResponseObjectAsync(request, returnBuildingInfoList.Distinct().ToList());

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(GetBuildingInformationUsingPostcodeAsync), ex);
            throw;
        }
        return response;
    }
    private async Task<HttpResponseData> BuildResponseObjectAsync(HttpRequestData request, List<DynamicsBuildingInformation> response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
