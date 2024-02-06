

using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Models.Dynamics;

public record NoticeModel()
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string DescribeRiskIncident { get; set; }
    public TimeModel WhenBecomeAware { get; set; }
    public string OrganisationName { get; set; }
    public string ActingOrg { get; set; }
    public string OrgRole { get; set; }
    public string ActingOrgRole { get; set; }
    public string ActionsToKeepSafe { get; set; }
}
