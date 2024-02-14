
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Models.Dynamics;

public record ReportModel()
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string NoticeReference { get; set; }
    public string OrgRole { get; set; }
    public string ActingOrgRole { get; set; }
    public string SubmittedNotice { get; set; }
    public string[] IncidentReported { get; set; }
    public string AboutIncident { get; set; }
    public string CauseOfIncident { get; set; }
    public string WhoAffectedByIncident { get; set; }
    public string IncidentKeepPeopleSafe { get; set; }
    public string OccurrenceDiscovered { get; set; }
    public string SharedWithOthers { get; set; }
    public string OrganisationName { get; set; }
    public string ActingOrg { get; set; }
    public TimeModel ReportWhenBecomeAware { get; set; }
    public string YourSupportInfo { get; set; }
    public FileUploadModel[] FilesUploaded { get; set; }
}
