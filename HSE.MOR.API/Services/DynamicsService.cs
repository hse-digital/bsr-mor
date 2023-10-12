using Flurl.Http;
using HSE.MOR.API.Models;
using HSE.MOR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace HSE.MOR.API.Services;

public interface IDynamicsService {
    Task SendVerificationEmail(string emailAddress, string otpToken);
    Task<List<DynamicsBuildingInformation>> GetBuildingInformationUsingPostcode_Async(string postcode);
    Task<List<DynamicsBuildingDetails>> GetBuildingDetailsUsingPostcode_Async(string postcode);
    Task<DynamicsBuildingControlApplication> GetBuildingControlApplicationId_Async(string bcaReferenceNumber);
    Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingId_Async(string applicationId);
    Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingBcaReference_Async(string bcaReference);
}

public class DynamicsService : IDynamicsService
{
    private readonly DynamicsOptions dynamicsOptions;
    private readonly SwaOptions swaOptions;
    private readonly DynamicsApi dynamicsApi;

    public DynamicsService(IOptions<DynamicsOptions> dynamicsOptions, IOptions<SwaOptions> swaOptions, DynamicsApi dynamicsApi) 
    {
        this.dynamicsOptions = dynamicsOptions.Value;
        this.swaOptions = swaOptions.Value;
        this.dynamicsApi = dynamicsApi;
    }
    public async Task SendVerificationEmail(string emailAddress, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new { emailAddress = emailAddress.ToLower(), otp = otpToken,  hrbRegUrl = swaOptions.Url });
    }

    public async Task<List<DynamicsBuildingInformation>> GetBuildingInformationUsingPostcode_Async(string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingInformation>>("bsr_blocks", new[]
        {
            ("$filter", $"bsr_postcode eq '{postcode}'")
        });

        return response.value.ToList();
    }

    public async Task<List<DynamicsBuildingDetails>> GetBuildingDetailsUsingPostcode_Async(string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingDetails>>("bsr_buildingdetailses", new[]
        {
            ("$filter", $"bsr_address1_postalcode eq '{postcode}'")
        });

        return response.value.ToList();
    }

    public async Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingId_Async(string applicationId) 
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingDetails>>("bsr_buildingdetailses", new[] 
        {
            ("$filter", $"_bsr_bcapplicationid_value eq '{applicationId}' ")
        });

        return response.value.ToList();
    }

    public async Task<DynamicsBuildingControlApplication> GetBuildingControlApplicationId_Async(string bcaReferenceNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingControlApplication>>("bsr_buildingcontrolapplications",
            new[] { ("$filter", $"bsr_bcaareferencenumber eq '{bcaReferenceNumber}'"), ("$select", "bsr_buildingcontrolapplicationid") });

        return response.value.FirstOrDefault();
    }

    public async Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingBcaReference_Async(string bcaReference) 
    {
        var buildingDetailsList = new List<DynamicsBuildingDetails>();
        var buildingControlApp = await GetBuildingControlApplicationId_Async(bcaReference);
        if (buildingControlApp is not null) 
        {
            if (!string.IsNullOrWhiteSpace(buildingControlApp.bsr_buildingcontrolapplicationid)) 
            {
                buildingDetailsList = await GetDynamicsBuildingDetailsUsingId_Async(buildingControlApp.bsr_buildingcontrolapplicationid);
            }          
        }
        return buildingDetailsList;
    }
}
