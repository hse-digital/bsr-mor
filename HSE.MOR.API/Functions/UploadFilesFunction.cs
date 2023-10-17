

using HSE.MOR.API.BlobStore;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Functions;

public class UploadFilesFunction
{
    private readonly IBlobSASUri blobSASUri;

    public UploadFilesFunction(IBlobSASUri blobSASUri)
    {
        this.blobSASUri = blobSASUri;
    }

    [Function(nameof(GetSASUri))]
    public async Task<HttpResponseData> GetSASUri([HttpTrigger(AuthorizationLevel.Anonymous, "get",
        Route = $"{nameof(GetSASUri)}/{{caseId}}/{{blobName}}")] HttpRequestData request, string caseId, string blobName)
    {
        var blobString = blobSASUri.GetSASUri($"{caseId}/{blobName}");

        return await BuildResponseObjectAsync(request, blobString);
    }
    private async Task<HttpResponseData> BuildResponseObjectAsync(HttpRequestData request, string response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
    private async Task<HttpResponseData> BuildFileResponseObjectAsync(HttpRequestData request, string response)
    {
        return await request.CreateObjectResponseAsync(response);
    }
}
