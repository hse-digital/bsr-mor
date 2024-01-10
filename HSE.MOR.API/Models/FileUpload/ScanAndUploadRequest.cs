

namespace HSE.MOR.API.Models.FileUpload;

public class ScanAndUploadRequest
{
    public string FilePath { get; set; }
    public string BlobName { get; set; }
    public string TaskId { get; set; }
    public string SASUri { get; set; }
    public string CustomerId { get; set; }
    public string IncidentId { get; set; }
}