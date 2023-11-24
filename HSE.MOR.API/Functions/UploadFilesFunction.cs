using HSE.MOR.API.BlobStore;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.FileUpload;

namespace HSE.MOR.API.Functions;

public class UploadFilesFunction
{
    private readonly IBlobSASUri blobSASUri;

    public UploadFilesFunction(IBlobSASUri blobSASUri)
    {
        this.blobSASUri = blobSASUri;
    }

    [Function(nameof(GetSASUri))]
    public async Task<HttpResponseData> GetSASUri([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<ScanAndUploadRequest>()!;
        scanRequest.TaskId = Guid.NewGuid().ToString();
        scanRequest.FilePath = Path.Combine(scanRequest.TaskId, scanRequest.BlobName);
        var uri = blobSASUri.GetSASUri(scanRequest.FilePath);
        scanRequest.SASUri = uri;
        return await BuildScanAndUploadRequestResponseObjectAsync(request, scanRequest);
    }   
    private async Task<HttpResponseData> BuildScanAndUploadRequestResponseObjectAsync(HttpRequestData request, ScanAndUploadRequest response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
    private async Task<HttpResponseData> BuildFileResponseObjectAsync(HttpRequestData request, string response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
