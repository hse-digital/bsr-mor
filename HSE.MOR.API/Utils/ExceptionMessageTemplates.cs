
namespace HSE.MOR.API.Utils;

public static class ExceptionMessageTemplates
{
    public const string ScanFileService_ScanFile = "Backing off and will retry. Error calling ScanFile - StatusCode = '{StatusCode}' - Payload = '{payload}' - Exception = '{Message}'";
    public const string ScanFileService_GetFileScanResult = "Backing off and will retry. Error calling GetFileScanResult - id = '{id}' - Exception = '{Message}'";
    public const string SharePointService_PushFileToSharePoint = "Error pushing to SharePoint - Request = '{request}' - Exception = '{Message}'";
    public const string SharePointService_ErrorReturnedFromUrl = "Error returned from '{Url}'. StatusCode = '{StatusCode}'. Message = '{Message}'. data = {data}";
    public const string ErrorRunningFileScan = "Error running File Scan - Exception = '{Message}'";
}
public static class FailureReasonTemplates
{
    public const string FileContainsVirus = "File contains virus or malware. TaskId = '{0}' FileName = '{1}'";


}
