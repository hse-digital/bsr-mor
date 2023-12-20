using HSE.MOR.API.Models.ScanFiles;
using HSE.MOR.API.Utils;
using HSE.MOR.API.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HSE.MOR.API.Models.FileUpload;
using Google.Protobuf.Reflection;

namespace HSE.MOR.API.Services.FileStore;

public interface ISharePointPusher
{
    Task PushToSharePointAsync(FileScanModel scanModel, CancellationToken cancellationToken);
}
public class SharePointPusher : ISharePointPusher
{

    private readonly ISharePointService sharePointService;
    private readonly IOptions<BlobStoreOptions> blobStoreOptions;
    private readonly IOptions<SharePointOptions> sharePointOptions;
    private readonly ILogger<SharePointPusher> logger;

    private const string _targetTable = "incident";
    private const string _subFolderPath = "Documents on Default Site 1";
    private const string _mainFileDescription = "Uploaded Files from MOR Portal";

    public SharePointPusher(ISharePointService sharePointService, IOptions<BlobStoreOptions> blobStoreOptions, IOptions<SharePointOptions> sharePointOptions, ILogger<SharePointPusher> logger)
    {
        this.sharePointService = sharePointService;
        this.blobStoreOptions = blobStoreOptions;
        this.sharePointOptions = sharePointOptions;
        this.logger = logger;
    }

    public async Task PushToSharePointAsync(FileScanModel scanModel, CancellationToken cancellationToken)
    {
        var request = default(UploadFileFlow);

        try
        {
            foreach (var item in scanModel.FileUploads)
            {
                var blobFile = SpecialCharCleaner.RemoveSpecialCharacters(item.FileName);
                request = GetRequestForFile(scanModel, item.TaskId, item.FileName, blobFile, _mainFileDescription, _subFolderPath);
                var pushResult = await this.sharePointService.PushFileToSharePointAsync(request);
            }
            
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, ExceptionMessageTemplates.SharePointService_PushFileToSharePoint, ex.Message, request);           
            throw;
        }       
    }

    private UploadFileFlow GetRequestForFile(FileScanModel scanModel, string taskId, string displayName, string blobName, string fileDescription, string subFolderPath = _subFolderPath)
    {
        var request = new UploadFileFlow();
        request.fileName = displayName;
        request.subFolderPath = subFolderPath;
        request.fileDescription = fileDescription;
        request.providerContactId = new Guid(scanModel.ContactId);
        request.targetRecordId = new Guid(scanModel.id);
        request.targetTable = _targetTable;
        request.azureBlobFilePath = Path.Combine(this.blobStoreOptions.Value.ContainerName, taskId, blobName).Replace('\\', '/');

        return request;
    }
}
