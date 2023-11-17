using Flurl.Http;
using HSE.MOR.API.Utils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HSE.MOR.API.Services.FileStore;

public interface ISharePointService
{
    Task<SharePointResponse> PushFileToSharePointAsync(UploadFileFlow data);
}

public class SharePointService : ISharePointService
{
    private readonly IOptions<SharePointOptions> sharePointOptions;
    private readonly ILogger<SharePointService> logger;

    public SharePointService(IOptions<SharePointOptions> sharePointOptions, ILogger<SharePointService> logger)
    {
        this.sharePointOptions = sharePointOptions;
        this.logger = logger;
    }

    public async Task<SharePointResponse> PushFileToSharePointAsync(UploadFileFlow data)
    {
        try
        {
            var response = await sharePointOptions.Value.UploadFileFlowUrl
                .PostJsonAsync(data, default);

            var result = await response.GetJsonAsync<SharePointResponse>();

            return result;
        }
        catch (FlurlHttpException ex)
        {
            logger.LogError(ex, ExceptionMessageTemplates.SharePointService_ErrorReturnedFromUrl, ex.Call.Request.Url, ex.StatusCode, ex.Call.Exception.Message, data);
            throw;
        }
    }
}
