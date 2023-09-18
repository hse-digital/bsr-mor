using Flurl.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace HSE.MOR.API.Services;

public interface IDynamicsService {
    Task SendVerificationEmail(string emailAddress, string otpToken);
}

public class DynamicsService : IDynamicsService
{
    private readonly DynamicsOptions dynamicsOptions;
    private readonly SwaOptions swaOptions;

    public DynamicsService(IOptions<DynamicsOptions> dynamicsOptions, IOptions<SwaOptions> swaOptions) 
    {
        this.dynamicsOptions = dynamicsOptions.Value;
        this.swaOptions = swaOptions.Value;
    }
    public async Task SendVerificationEmail(string emailAddress, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new { emailAddress = emailAddress.ToLower(), otp = otpToken,  hrbRegUrl = swaOptions.Url });
    }
}
