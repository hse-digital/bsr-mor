

using HSE.MOR.Domain.Entities;
using Microsoft.DurableTask;
using System.Net.Mail;
using System.Net;
using System.Text.RegularExpressions;

namespace HSE.MOR.API.Models.Dynamics;

public record IncidentModel : IValidatableModel
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
        if (string.IsNullOrWhiteSpace(WhatToSubmit)) 
        {
            errors.Add("WhatToSubmit is required");
        }
        if (string.IsNullOrWhiteSpace(EmailAddress))
        {
            errors.Add("Email Address is required");
        }
        if(Notice is null && Report is null) 
        {
            errors.Add("Notice or Report model is required");
        }
        if (Report is null) 
        {
            if (Notice is not null && Building is null) 
            {
                errors.Add("Building model is required");
            }
        }
        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
   
}
