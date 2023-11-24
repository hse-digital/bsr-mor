
namespace HSE.MOR.API.Services.ScanFiles;

public class ScanFileOptions
{
    public const string Section = "Integrations";

    public string CommonAPIEndpoint { get; set; } = string.Empty;
    public string CommonAPIKey { get; set; } = string.Empty;
    public string Application { get; set; } = string.Empty;
    public int MaxUploadFileSize { get; set; }
    public string? AllowedFileTypes { get; set; }
}
