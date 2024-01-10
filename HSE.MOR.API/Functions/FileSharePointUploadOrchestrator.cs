using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Models.ScanFiles;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSE.MOR.API.Functions
{
    public class FileSharePointUploadOrchestrator
    {
        private readonly IOptions<IntegrationsOptions> integrationsOptions;

        public FileSharePointUploadOrchestrator(IOptions<IntegrationsOptions> integrationsOptions)
        {
            this.integrationsOptions = integrationsOptions;
        }

        [Function(nameof(UploadFilesToShareActivityPoint))]
        public async Task UploadFilesToShareActivityPoint([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
        {
            var scanModel = orchestrationContext.GetInput<FileScanModel>();

            //await orchestrationContext.CallActivityAsync(nameof(ScanFileFunction.ScanFileActivityFunctionAsync), scanModel);

            //time delay set because sharepoint upload fails if triggered straight after incident is created in D365
            await orchestrationContext.CreateTimer(orchestrationContext.CurrentUtcDateTime.AddSeconds(this.integrationsOptions.Value.ScanFileDelaySeconds), CancellationToken.None);

            //var scanResults = await orchestrationContext.CallActivityAsync<List<FileScanResult>>(nameof(ScanFileFunction.GetFileScanResultsActivityFunctionAsync), scanModel);

            //var successScanFiles = scanModel.FileUploads.Where(s => scanResults.Where(x => x.Success).Any(d => d.Id == s.TaskId)).ToArray();
            
            //var successModel = scanModel;
            //successModel.FileUploads = successScanFiles.ToArray();
         
            await orchestrationContext.CallActivityAsync(nameof(SharePointFunction.PushToSharePointActivityAsync), scanModel);

            //var failedScanFiles = scanModel.FileUploads.Where(s => scanResults.Where(x => !x.Success).Any(d => d.Id == s.TaskId)).ToArray();

            //var failedModel = scanModel;
            //failedModel.FileUploads = failedScanFiles.ToArray();
        }
    }
}
