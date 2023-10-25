
namespace HSE.MOR.Domain.Entities;

public record Notice(string Id = null) : Entity(Id)
{
    public string DescribeRiskIncident { get; set; }
    public TimeModel WhenBecomeAware { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string OrganisationName { get; set; }
    public string OrgRole { get; set; }
    public string ActionsToKeepSafe { get; set; }
}

public record TimeModel
{
  public string Day { get; set; }
  public string Month { get; set; }
  public string Year { get; set; }
  public string Hour { get; set; }
  public string Minute { get; set; }
}