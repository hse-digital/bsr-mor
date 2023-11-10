

using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Models.Dynamics;

public record IncidentModel
{
    public string Id { get; set; }
    public string WhatToSubmit { get; set; }    
    public string BuildingName { get; set; }
    public MORModel MOR { get; set; }
    public NoticeModel Notice { get; set; }
    public ReportModel Report { get; set; }
    public BuildingModel Building { get; set; }
    public string EmailAddress { get; set; }
    public string CaseNumber { get; set; }
}
