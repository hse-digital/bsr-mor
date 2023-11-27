

using HSE.MOR.Domain.Entities;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HSE.MOR.API.Models.Dynamics;

public record NoticeModel() : IValidatableModel
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

    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(FirstName)) 
        {
            errors.Add("FirstName is required");
        }
        if (string.IsNullOrWhiteSpace(LastName))
        {
            errors.Add("LastName is required");
        }
        if (string.IsNullOrWhiteSpace(ContactNumber))
        {
            errors.Add("ContactNumber is required");
        }
        if (!string.IsNullOrWhiteSpace(ContactNumber)) 
        {
            if (!PhoneNumberIsValid())
            {
                errors.Add("You must enter a UK telephone number. For example, 01632 960 001, 07700 900 982 or +44 808 157 0192");
            }
        }
        if (string.IsNullOrWhiteSpace(OrganisationName))
        {
            errors.Add("OrganisationName is required");
        }
        if (string.IsNullOrWhiteSpace(OrgRole))
        {
            errors.Add("OrganisationName is required");
        }
        if (string.IsNullOrWhiteSpace(DescribeRiskIncident))
        {
            errors.Add("OrganisationName is required");
        }
        if (string.IsNullOrWhiteSpace(ActionsToKeepSafe))
        {
            errors.Add("OrganisationName is required");
        }
        if (WhenBecomeAware is null) 
        {
            errors.Add("WhenBecomeAware is required");
        }
        if (WhenBecomeAware is not null)
        {
            if (string.IsNullOrWhiteSpace(WhenBecomeAware.Year)) 
            {
                errors.Add("WhenBecomeAware Year is required");
            }
            if (string.IsNullOrWhiteSpace(WhenBecomeAware.Month))
            {
                errors.Add("WhenBecomeAware Month is required");
            }
            if (string.IsNullOrWhiteSpace(WhenBecomeAware.Day))
            {
                errors.Add("WhenBecomeAware Day is required");
            }
            if (string.IsNullOrWhiteSpace(WhenBecomeAware.Hour))
            {
                errors.Add("WhenBecomeAware Hour is required");
            }
            if (string.IsNullOrWhiteSpace(WhenBecomeAware.Minute))
            {
                errors.Add("WhenBecomeAware Minute is required");
            }

        }
        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }

    private bool PhoneNumberIsValid()
    {
        var noSpacesPhoneNumber = ContactNumber.Replace(" ", string.Empty);
        return Regex.IsMatch(noSpacesPhoneNumber, @"^\+44\d{10}$") || Regex.IsMatch(noSpacesPhoneNumber, @"^0\d{10}$");
    }
}
