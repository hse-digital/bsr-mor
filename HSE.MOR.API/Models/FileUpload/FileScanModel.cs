

namespace HSE.MOR.API.Models.FileUpload;

public class FileScanModel
{
    public string id { get; set; }
    public string ContactId { get; set; }
    public string Email { get; set; }
    public Models.Dynamics.FileUploadModel[] FileUploads { get; set; }
}
