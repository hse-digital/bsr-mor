

using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask.Client;
using Microsoft.Extensions.Logging;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.FileUpload;

namespace HSE.MOR.API.Functions;

public class TriggerFilesScanAndUploadFunction
{
    [Function(nameof(TriggerFilesToSharePointUpload))]
    public async Task<HttpResponseData> TriggerFilesToSharePointUpload([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request,
        [DurableClient] DurableTaskClient durableTaskClient, CancellationToken cancellationToken)
    {
        var scanModel = await request.ReadAsJsonAsync<FileScanModel>();
        var orchestrationId = await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(FileSharePointUploadOrchestrator.UploadFilesToShareActivityPoint), scanModel);

        return durableTaskClient.CreateCheckStatusResponse(request, orchestrationId, cancellationToken);
    }

}
