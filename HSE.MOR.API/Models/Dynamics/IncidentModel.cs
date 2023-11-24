

using HSE.MOR.Domain.Entities;
using Microsoft.DurableTask;
using System.Net.Mail;
using System.Net;
using System.Text.RegularExpressions;

namespace HSE.MOR.API.Models.Dynamics;

public record IncidentModel
{
    public string Id { get; set; }
    public string WhatToSubmit { get; set; }    
    public string BuildingName { get; set; }
    public NoticeModel Notice { get; set; }
    public ReportModel Report { get; set; }
    public BuildingModel Building { get; set; }
    public string EmailAddress { get; set; }
    public string CaseNumber { get; set; }
    public string CustomerId { get; set; }
    public string MorId { get; set; }

    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        


        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
   
}
