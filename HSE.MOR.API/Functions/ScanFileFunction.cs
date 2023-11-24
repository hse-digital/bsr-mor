

using AutoMapper.Internal.Mappers;
using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Models.ScanFiles;
using HSE.MOR.API.Services;
using HSE.MOR.API.Services.ScanFiles;
using HSE.MOR.API.Utils;
using Microsoft.Azure.Functions.Worker;
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

    [Function(nameof(ScanFileFunctionAsync))]
    public async Task ScanFileFunctionAsync([ActivityTrigger] FileScanModel scanModel)
    {
        foreach (var item in scanModel.FileUploads) {
            await this.scanFileService.ScanFileAsync(item.TaskId, item.FileName, default);
        }
    }

    [Function(nameof(GetFileScanResultsFunctionAsync))]
    public async Task<List<FileScanResult>> GetFileScanResultsFunctionAsync([ActivityTrigger] FileScanModel scanModel)
    {
        var resultList = new List<FileScanResult>();
        foreach (var item in scanModel.FileUploads) 
        {
            var result = await this.scanFileService.GetFileScanResultAsync(item.TaskId, default);
            resultList.Add(result);
        }        
        return resultList;
    }
}
