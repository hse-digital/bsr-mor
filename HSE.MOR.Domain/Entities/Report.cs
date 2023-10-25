

using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Report(string Id = null) : Entity(Id)
{
    public string NoticeReference { get; set; }
    public string OrgRole { get; set; }
    public string WhatToReport { get; set; }
    public string SubmittedNotice { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string IncidentReported { get; set; }
    public string RiskReported { get; set; }
    public string AboutRisk { get; set; }
    public string AboutIncident { get; set; }
    public string CauseOfRisk { get; set; }
    public string CauseOfIncident { get; set; }
    public string WhoAffectedByIncident { get; set; }
    public string WhoAffectedByRisk { get; set; }
    public string RiskKeepPeopleSafe { get; set; }
    public string IncidentKeepPeopleSafe { get; set; }
    public string OrganisationFindOut { get; set; }
    public string OccurrenceDiscovered { get; set; }
    public string SharedWithOthers { get; set; }
    public string OrganisationName { get; set; }
    public string ContactNumber { get; set; }
    public string YourSupportInfo { get; set; }
}

public record DynamicsReport() : DynamicsEntity<Report>
{
    public string incidentid { get; set; }
    public string bsr_case { get; set; }

    public DateTime bsr_noticesubmittedon { get; set; }
    public MorStage bsr_morstage { get; set; }
    public NoticeRole bsr_noticesubmittedbyrole { get; set; }
    public string bsr_reportorganisationname { get; set; }
    public DateTime bsr_occurrenceidentifiedon { get; set; } //notice
    public IncidentOrSituation bsr_incidentorsituation { get; set; }
    public TypeOfOccurrence bsr_typeofoccurrence { get; set; }
    public string bsr_occurrencedescription { get; set; }
    public string bsr_cause { get; set; }
    public string bsr_affected { get; set; }
    public string bsr_actionstokeeppeoplesafe { get; set; }
    public string bsr_howdiscovered { get; set; }
    [property: JsonPropertyName("bsr_noticesubmittedby@odata.bind")]
    public string customerReferenceId { get; set; }
    
    public string title { get; set; }
}

public enum TypeOfOccurrence
{
    StructuralFailure = 760810000,
    FireSpread = 760810001
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
