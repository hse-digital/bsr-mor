
namespace HSE.MOR.API.Models.ScanFiles;

public record FileScanResult(string Id, string ContainerName, string FileName, string Application, bool Success, bool IsComplete = true);
