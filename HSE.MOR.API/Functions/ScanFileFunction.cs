

using AutoMapper.Internal.Mappers;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Models.ScanFiles;
using HSE.MOR.API.Services;
using HSE.MOR.API.Services.ScanFiles;
using HSE.MOR.API.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using static System.Net.Mime.MediaTypeNames;

namespace HSE.MOR.API.Functions;

public class ScanFileFunction
{
    private readonly IScanFileService scanFileService;
    private readonly ILogger<ScanFileFunction> logger;

    public ScanFileFunction(IScanFileService scanFileService, ILogger<ScanFileFunction> logger)
    { 
        this.scanFileService = scanFileService;
        this.logger = logger;
    }

    [Function(nameof(ScanFileActivityFunctionAsync))]
    public async Task ScanFileActivityFunctionAsync([ActivityTrigger] FileScanModel scanModel)
    {
        foreach (var item in scanModel.FileUploads) {
            await this.scanFileService.ScanFileActivityAsync(item.TaskId, item.FileName, default);
        }
    }

    [Function(nameof(ScanFileFunctionAsync))]
    public async Task<HttpResponseData> ScanFileFunctionAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<ScanAndUploadRequest>()!;
        var blobName = SpecialCharCleaner.RemoveSpecialCharacters(scanRequest.BlobName);
        await this.scanFileService.ScanFileActivityAsync(scanRequest.TaskId, blobName, default);
        return await request.CreateObjectResponseAsync(scanRequest);
    }

    [Function(nameof(GetFileScanResultsActivityFunctionAsync))]
    public async Task<List<FileScanResult>> GetFileScanResultsActivityFunctionAsync([ActivityTrigger] FileScanModel scanModel)
    {
        var resultList = new List<FileScanResult>();
        foreach (var item in scanModel.FileUploads) 
        {
            var result = await this.scanFileService.GetFileScanResultAsync(item.TaskId, item.FileName, default);
            resultList.Add(result);
        }        
        return resultList;
    }

    [Function(nameof(GetFileScanResultsFunctionAsync))]
    public async Task<HttpResponseData> GetFileScanResultsFunctionAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var scanRequest = encodedRequest.GetDecodedData<ScanAndUploadRequest>()!;
        var result = await this.scanFileService.GetFileScanResultAsync(scanRequest.TaskId, scanRequest.BlobName, default);
        return await request.CreateObjectResponseAsync(result);
    }
}
