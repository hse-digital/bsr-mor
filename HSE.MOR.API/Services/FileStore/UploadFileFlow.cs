
namespace HSE.MOR.API.Services.FileStore;

public record UploadFileFlow
{
    public string fileName { get; set; } = string.Empty;
    public string subFolderPath { get; set; } = string.Empty;
    public string fileDescription { get; set; } = string.Empty;
    public Guid providerContactId { get; set; }
    public Guid targetRecordId { get; set; }
    public string targetTable { get; set; } = string.Empty;
    public string azureBlobFilePath { get; set; } = string.Empty;
}
