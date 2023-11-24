

namespace HSE.MOR.API.Models.Dynamics;

public record FileUploadModel
{
    public int Progress { get; set; }   
    public string FileName { get; set; }
    public string Status { get; set; } 
    public string Message { get; set; }
    public string CaseId { get; set; }
    public string SASUri { get; set; }
    public string TaskId { get; set; }
}
