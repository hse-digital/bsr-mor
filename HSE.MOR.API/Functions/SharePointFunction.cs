using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Services.FileStore;
using Microsoft.Azure.Functions.Worker;
using static System.Net.Mime.MediaTypeNames;

namespace HSE.MOR.API.Functions;

public class SharePointFunction
{
    private readonly ISharePointPusher sharePointPusher;
    public SharePointFunction(ISharePointPusher sharePointPusher) 
    { 
        this.sharePointPusher = sharePointPusher;
    }
    [Function(nameof(PushToSharePointAsync))]
    public async Task PushToSharePointAsync([ActivityTrigger] FileScanModel scanModel)
    {
        await this.sharePointPusher.PushToSharePointAsync(scanModel, default);
    }
}
