
using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Notice(string Id = null) : Entity(Id)
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string DescribeRiskIncident { get; set; }
    public TimeModel WhenBecomeAware { get; set; }
    public string OrganisationName { get; set; }
    public string OrgRole { get; set; }
    public string ActionsToKeepSafe { get; set; }
    public string CustomerNoticeReferenceId { get; set; }
    public string IncidentReference { get; set; }
    public Building BuildingModel { get; set; }
}



public record DynamicsNotice() : DynamicsEntity<Notice>
{
    public string bsr_incident { get; set; }
    public DateTime? bsr_noticesubmittedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public MorStage? bsr_morstage { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public NoticeRole? bsr_noticesubmittedbyrole { get; set; }
    public string bsr_noticeorganisationname { get; set; }
    public DateTime? bsr_occurrenceidentifiedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public BuildingCode? bsr_bsr_identifybuildingcode { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public BuildingType? bsr_howwouldyoudescribethebuilding { get; set; }
    public string bsr_occurrencedescription { get; set; }
    public string bsr_briefdescription { get; set; }
    public string bsr_immediateactionstaken { get; set; }
    public string bsr_cause { get; set; }
    public string bsr_affected { get; set; }
    public string bsr_actionstokeeppeoplesafe { get; set; }
    public string bsr_howdiscovered { get; set; }
    public string bsr_buildinglocation { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_noticesubmittedby@odata.bind")]
    public string customerNoticeReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_Incident@odata.bind")]
    public string incidentReference { get; set; }
    public string title { get; set; }
}