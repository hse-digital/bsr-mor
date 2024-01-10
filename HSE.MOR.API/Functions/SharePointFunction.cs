using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Services.FileStore;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using static System.Net.Mime.MediaTypeNames;

namespace HSE.MOR.API.Functions;

public class SharePointFunction
{
    private readonly ISharePointPusher sharePointPusher;
    public SharePointFunction(ISharePointPusher sharePointPusher) 
    { 
        this.sharePointPusher = sharePointPusher;
    }
    [Function(nameof(PushToSharePointActivityAsync))]
    public async Task PushToSharePointActivityAsync([ActivityTrigger] FileScanModel scanModel)
    {
        await this.sharePointPusher.PushToSharePointAsync(scanModel, default);
    }

    [Function(nameof(PushToSharePointAsync))]
    public async Task<HttpResponseData> PushToSharePointAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<FileScanModel>()!;
        await this.sharePointPusher.PushToSharePointAsync(scanRequest, default);
        return await request.CreateObjectResponseAsync(scanRequest);
    }
}
