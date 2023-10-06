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
}
