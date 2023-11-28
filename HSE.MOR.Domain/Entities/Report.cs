using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Report(string Id = null) : Entity(Id)
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string NoticeReference { get; set; }
    public string  OrgRole { get; set; }
    public string SubmittedNotice { get; set; }   
    public string[] IncidentReported { get; set; }
    public string AboutIncident { get; set; }
    public string CauseOfIncident { get; set; }
    public string WhoAffectedByIncident { get; set; }
    public string IncidentKeepPeopleSafe { get; set; }
    public string OccurrenceDiscovered { get; set; }
    public string SharedWithOthers { get; set; }
    public string OrganisationName { get; set; }
    public string YourSupportInfo { get; set; }
    public string CustomerReportReferenceId { get; set; }
    public string IncidentReference { get; set; }
    public Building BuildingModel { get; set; }
}

public record DynamicsReport : DynamicsEntity<Report>
{
    public string bsr_incident { get; set; }
    public DateTime bsr_noticesubmittedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public MorStage bsr_morstage { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public OccurrenceType bsr_typeofoccurrence { get; set; }
    public string bsr_occurrencedescription { get; set; }
    public string bsr_cause { get; set; }
    public string bsr_affected { get; set; }
    public string bsr_actionstokeeppeoplesafe { get; set; }
    public string bsr_howdiscovered { get; set; }
    public string bsr_infotobeshared { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_reportsubmittedby@odata.bind")]
    public string customerReportReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_Incident@odata.bind")]
    public string incidentReference { get; set; }
    public string bsr_reportorganisationname { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public NoticeRole bsr_noticesubmittedbyrole { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public DateTime bsr_occurrenceidentifiedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public IncidentOrSituation bsr_incidentorsituation { get; set; }
}

