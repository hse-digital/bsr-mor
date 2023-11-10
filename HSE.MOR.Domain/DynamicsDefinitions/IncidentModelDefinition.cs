
using HSE.MOR.Domain.Entities;
using System.Globalization;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class IncidentModelDefinition : DynamicsModelDefinition<Incident, DynamicsIncident>
{
    public override string Endpoint => "incidents";
    private DynamicsIncident dynamicsIncident;

    public override DynamicsIncident BuildDynamicsEntity(Incident entity)
    {
        this.dynamicsIncident = new DynamicsIncident();
        this.dynamicsIncident.customerReferenceId = $"/contacts({entity.CustomerId})";
        this.dynamicsIncident.primaryContactReferenceId = $"/contacts({entity.CustomerId})";
        this.dynamicsIncident.morReferenceId = string.IsNullOrWhiteSpace(entity.MorId) ? null : $"/bsr_mors({entity.MorId})";
        this.dynamicsIncident.bsr_contactfirstname = entity.WhatToSubmit == "notice" ? entity.MorModel.NoticeFirstName : entity.MorModel.ReportFirstName;
        this.dynamicsIncident.bsr_contactlastname = entity.WhatToSubmit == "notice" ? entity.MorModel.NoticeLastName : entity.MorModel.ReportLastName;
        this.dynamicsIncident.bsr_contactphone = entity.WhatToSubmit == "notice" ? entity.MorModel.NoticeContactNumber : entity.MorModel.ReportContactNumber;
        this.dynamicsIncident.bsr_contactemail = entity.EmailAddress;
        this.dynamicsIncident.bsr_yoursupportinginformation = entity.WhatToSubmit == "notice" ? null : entity.MorModel.YourSupportInfo;
        this.dynamicsIncident.statecode = 0;
        this.dynamicsIncident.statuscode = 2;
        this.dynamicsIncident.caseorigincode = 3;
        this.dynamicsIncident.incidentstagecode = 1;
        this.dynamicsIncident.casetypecode = 3;
        return this.dynamicsIncident;
    }

    private int? TryGetInt(string number)
    {
        var integer = Int32.TryParse(number, out var value);
        if (integer)
        {
            return value;
        }
        else
        {
            return null;
        }
    }
    private double? TryGetDouble(string number)
    {
        var integer = Double.TryParse(number, out var value);
        if (integer)
        {
            return value;
        }
        else
        {
            return null;
        }
    }

    private DateTime? GetDate(string year, string month, string day)
    {
        var dateString = $"{year}/{month}/{day}";
        var dateTime = DateTime.UtcNow;
        var isDate = DateTime.TryParse(dateString, new CultureInfo("en-GB"), out dateTime);
        return isDate ? dateTime : null;
    }

    public override Incident BuildEntity(DynamicsIncident dynamicsEntity)
    {
        throw new NotImplementedException();
    }
      
}
