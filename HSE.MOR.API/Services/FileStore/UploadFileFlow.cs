
namespace HSE.MOR.API.Services.FileStore;

public record UploadFileFlow
{
    public string FileName { get; set; } = string.Empty;
    public string SubFolderPath { get; set; } = string.Empty;
    public string FileDescription { get; set; } = string.Empty;
    public Guid ProviderContactId { get; set; }
    public Guid TargetRecordId { get; set; }
    public string TargetTable { get; set; } = string.Empty;
    public string AzureBlobFilePath { get; set; } = string.Empty;
}
