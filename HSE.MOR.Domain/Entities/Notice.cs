
using System.Text.Json.Serialization;

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



public record DynamicsNotice() : DynamicsEntity<Notice>
{
    public string bsr_noticesubmittedon { get; set; }
    public string bsr_case { get; set; }
    public MorStage bsr_morstage { get; set; }
    public NoticeRole bsr_noticesubmittedbyrole { get; set; }
    public string bsr_reportorganisationname { get; set; }
    public DateTime bsr_occurrenceidentifiedon { get; set; } //notice
    public IncidentOrSituation bsr_incidentorsituation { get; set; }
    //public TypeOfOccurrence bsr_typeofoccurrence { get; set; }
    public string bsr_occurrencedescription { get; set; }
    public string bsr_cause { get; set; }
    public string bsr_affected { get; set; }
    public string bsr_actionstokeeppeoplesafe { get; set; }
    public string bsr_howdiscovered { get; set; }
    [property: JsonPropertyName("bsr_noticesubmittedby@odata.bind")]
    public string customerReferenceId { get; set; }

    public string title { get; set; }
}