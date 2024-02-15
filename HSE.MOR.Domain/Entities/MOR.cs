

using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Mor(string Id = null) : Entity(Id)
{

    public string MORNumber { get; set; }
    public string NoticeFirstName { get; set; }
    public string NoticeLastName { get; set; }
    public string NoticeContactNumber { get; set; }
    public string ReportFirstName { get; set; }
    public string ReportLastName { get; set; }
    public string ReportContactNumber { get; set; }
    public string DescribeRiskIncident { get; set; }
    public TimeModel WhenBecomeAware { get; set; }
    public string NoticeOrganisationName { get; set; }
    public string NoticeActingOrg { get; set; }
    public string ReportOrganisationName { get; set; }
    public string ReportActingOrg { get; set; }
    public TimeModel ReportWhenBecomeAware { get; set; }
    public string NoticeOrgRole { get; set; }
    public string NoticeOrgType { get; set; }
    public string NoticeActingOrgRole { get; set; }
    public string NoticeActingOrgType { get; set; }
    public string ReportOrgRole { get; set; }
    public string ReportOrgType { get; set; }
    public string ReportActingOrgRole { get; set; }
    public string ReportActingOrgType { get; set; }
    public string ActionsToKeepSafe { get; set; }
    public string CustomerNoticeReferenceId { get; set; }
    public string IncidentReference { get; set; }
    public Building BuildingModel { get; set; }
    public string NoticeReference { get; set; }
    public string SubmittedNotice { get; set; }
    public string[] IncidentReported { get; set; }
    public string AboutIncident { get; set; }
    public string CauseOfIncident { get; set; }
    public string WhoAffectedByIncident { get; set; }
    public string IncidentKeepPeopleSafe { get; set; }
    public string OccurrenceDiscovered { get; set; }
    public string SharedWithOthers { get; set; }
    public string YourSupportInfo { get; set; }
    public string CustomerReportReferenceId { get; set; }
    public bool IsNotice { get; set; }
    public bool IsReportSubmitted { get; set; }
}

public record TimeModel
{
    public string Day { get; set; }
    public string Month { get; set; }
    public string Year { get; set; }
    public string Hour { get; set; }
    public string Minute { get; set; }
}



public record DynamicsMor() : DynamicsEntity<Mor>
{
    public string bsr_incident { get; set; }
    public string bsr_name { get; set; }
    public DateTime? bsr_noticesubmittedon { get; set; }
    public DateTime? bsr_reportsubmittedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public MorStage? bsr_morstage { get; set; }
    public NoticeRole? bsr_noticesubmittedbyrole { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public NoticeRole? bsr_reportsubmittedbyrole { get; set; }
    public string bsr_noticeorganisationname { get; set; }
    public DateTime? bsr_occurrenceidentifiedon { get; set; }
    public DateTime? bsr_occurrenceidentifiedupdate { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public BuildingCode? bsr_bsr_identifybuildingcode { get; set; }
    public BuildingType? bsr_howwouldyoudescribethebuilding { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_occurrencedescription { get; set; }
    public string bsr_noticeactingorgname { get; set; }

    //organisation type field notice. Change when the field is added to the D365
    //public string bsr_noticeorganisationtype { get; set; }

    //acting organisation type field notice. Change when the field is added to the D365
    //public string bsr_noticeactingorganisationtype { get; set; }

    //organisation type field report. Change when the field is added to the D365
    //[property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    //public string bsr_reportorganisationtype { get; set; }

    //acting organisation type field report. Change when the field is added to the D365
    //[property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    //public string bsr_reportactingorganisationtype { get; set; }

    public ActingRole? bsr_noticeactingrole { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_reportactingorgname { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public ActingRole? bsr_reportactingrole { get; set; }
    public string bsr_briefdescription { get; set; }
    public string bsr_immediateactionstaken { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_cause { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_affected { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_actionstokeeppeoplesafe { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_howdiscovered { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildinglocation { get; set; }
    [property: JsonPropertyName("bsr_noticesubmittedby@odata.bind")]
    public string customerNoticeReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_Incident@odata.bind")]
    public string incidentReference { get; set; }
    public string title { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_infotobeshared { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_reportsubmittedby@odata.bind")]
    public string customerReportReferenceId { get; set; }    
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public IncidentOrSituation? bsr_incidentorsituation { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_typeofoccurrence { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_reportorganisationname { get; set; }
}

public enum TypeOfOccurrence
{
    StructuralFailure = 760810000,
    FireSpread = 760810001,
    FireSafety = 760810002
}

public enum IncidentOrSituation
{
    Incident = 760810000,
    Risk = 760810001
}

public enum MorStage
{
    NoticeSubmitted = 760810000,
    ReportSubmitted = 760810001
}

public enum NoticeRole
{
    AccountablePerson = 760810000,
    PrincipalAccountablePerson = 760810001,
    PrincipalContractor = 760810002,
    PrincipalDesigner = 760810003,
    ActingOnBehalf = 760810004,
    Other = 760810005

}

public enum ActingRole
{
    AccountablePerson = 760810000,
    PrincipalAccountablePerson = 760810001,
    PrincipalContractor = 760810002,
    PrincipalDesigner = 760810003,
    Other = 760810004,
}

public enum OccurrenceType
{
    StructuralFailure = 760810000,
    FireSpread = 760810001,
    FireSafety = 760810002,
}

public enum BuildingCode
{
    HRBNumber = 760810000,
    BCAReference = 760810001
}

public enum BuildingType
{
    Occupied = 760810000,
    CompleteNotOccupied = 760810001,
    InConstruction = 760810002,
    InDesign = 760810003,
}
