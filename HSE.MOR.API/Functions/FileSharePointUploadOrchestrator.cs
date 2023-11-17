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

        [Function(nameof(UploadFilesToSharePoint))]
        public async Task UploadFilesToSharePoint([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
        {        
            var scanModel = orchestrationContext.GetInput<FileScanModel>();
            
            await orchestrationContext.CallActivityAsync(nameof(ScanFileFunction.ScanFileFunctionAsync), scanModel);

            await orchestrationContext.CreateTimer(orchestrationContext.CurrentUtcDateTime.AddMinutes(this.integrationsOptions.Value.ScanFileDelayMinutes), CancellationToken.None);

            var scanResults = await orchestrationContext.CallActivityAsync<List<FileScanResult>>(nameof(ScanFileFunction.GetFileScanResultsFunctionAsync), scanModel);
            
            var successScanFiles = scanModel.FileUploads.Where(s => scanResults.Where(x => x.Success).Any(d => d.Id == s.TaskId));
            var failedScanFiles = scanModel.FileUploads.Where(s => scanResults.Where(x => !x.Success).Any(d => d.Id == s.TaskId));
            
            var successModel = scanModel;
            successModel.FileUploads = successScanFiles.ToArray();

            var failedModel = scanModel;
            failedModel.FileUploads = failedScanFiles.ToArray();

            foreach (var result in scanResults)
            {
                await orchestrationContext.CallActivityAsync(nameof(SharePointFunction.PushToSharePointAsync), successModel);
            }
            
         
        }
    }
}
