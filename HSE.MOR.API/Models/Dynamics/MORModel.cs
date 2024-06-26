﻿

using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Models.Dynamics;

public record MORModel()
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string DescribeRiskIncident { get; set; }
    public TimeModel WhenBecomeAware { get; set; }
    public string OrganisationName { get; set; }
    public string OrgRole { get; set; }
    public string ActionsToKeepSafe { get; set; }
    public string NoticeReference { get; set; }
    public string WhatToReport { get; set; }
    public string SubmittedNotice { get; set; }
    public string[] IncidentReported { get; set; }
    public string[] RiskReported { get; set; }
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
    public string YourSupportInfo { get; set; }
}
