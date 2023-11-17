using Flurl;
using Flurl.Http;
using HSE.MOR.API.Models.ScanFiles;
using HSE.MOR.API.Utils;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Text.RegularExpressions;

namespace HSE.MOR.API.Services.ScanFiles;

public interface IScanFileService
{
    Task ScanFileAsync(string id, string blobName, CancellationToken cancellationToken);
    Task<FileScanResult> GetFileScanResultAsync(string id, CancellationToken cancellationToken);
}

public class ScanFileService : IScanFileService
{
    private readonly IOptions<ScanFileOptions> scanFileOptions;
    private readonly IOptions<BlobStoreOptions> blobStoreOptions;
    private readonly ILogger<ScanFileService> logger;
    private readonly bool allowTestFile;
    private readonly string testFileName = string.Empty;

    public ScanFileService(
        IOptions<ScanFileOptions> scanFileOptions,
        IOptions<BlobStoreOptions> blobStoreOptions,
        IOptions<FeatureOptions> featureOptions,
        ILogger<ScanFileService> logger)
    {
        this.scanFileOptions = scanFileOptions;
        this.blobStoreOptions = blobStoreOptions;
        this.logger = logger;
        this.allowTestFile = featureOptions.Value.AllowTestFile;
        this.testFileName = featureOptions.Value.TestFileName;
    }

    public async Task ScanFileAsync(string fileId, string blobName, CancellationToken cancellationToken)
    {
        var payload = new FileScanRequest(fileId, blobStoreOptions.Value.ContainerName, blobName, scanFileOptions.Value.Application);
        var response = default(IFlurlResponse);

        try
        {
            response = await scanFileOptions.Value.CommonAPIEndpoint
                .AppendPathSegment(FlurlSettings.ApiSegment)
                .AppendPathSegment(nameof(ScanFileAsync))
                .WithHeader(FlurlSettings.XFunctionsKey, scanFileOptions.Value.CommonAPIKey)
                .PostJsonAsync(payload, cancellationToken);
        }
        catch (FlurlHttpException ex)
        {
            logger.LogInformation(ex, ExceptionMessageTemplates.ScanFileService_ScanFile, response?.StatusCode, payload, ex.Message);

            throw new RetryException("Retry", ex);
        }
    }

    public async Task<FileScanResult> GetFileScanResultAsync(string id, CancellationToken cancellationToken)
    {
        try
        {
            var response = await scanFileOptions.Value.CommonAPIEndpoint
                .AppendPathSegment(FlurlSettings.ApiSegment)
                .AppendPathSegment(nameof(GetFileScanResultAsync))
                .SetQueryParam("id", id)
                .WithHeader(FlurlSettings.XFunctionsKey, scanFileOptions.Value.CommonAPIKey)
                .GetJsonAsync<FileScanResult>(cancellationToken);

            if (allowTestFile && GetTestFileName(response.FileName))
            {
                response = new FileScanResult(response.Id, response.ContainerName, response.FileName, response.Application, false);
            }

            return response;
        }
        catch (FlurlHttpException ex) when (ex.StatusCode == (int)HttpStatusCode.NotFound)
        {
            logger.LogInformation(ex, ExceptionMessageTemplates.ScanFileService_GetFileScanResult, id, ex.Message);

            throw new RetryException("Retry", ex);
        }
    }

    private bool GetTestFileName(string fileName)
    {
        try
        {
            //var testFileName = fileName.Split('/')[1].Split('-')[0];
            //var result = testFileName == _testFileName.Replace(".pdf", "");
            var result = Regex.Match(fileName, testFileName).Success;
            return result;
        }
        catch
        {
            return false;
        }

    }
}
