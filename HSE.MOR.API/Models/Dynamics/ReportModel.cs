using System.Text.RegularExpressions;

namespace HSE.MOR.API.Models.Dynamics;

public record ReportModel() : IValidatableModel
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ContactNumber { get; set; }
    public string NoticeReference { get; set; }
    public string OrgRole { get; set; }
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
    public FileUploadModel[] FilesUploaded { get; set; }

    public ValidationSummary Validate()
    {
        var errors = new List<string>();       
        if (!string.IsNullOrWhiteSpace(NoticeReference))
        {
            if (string.IsNullOrWhiteSpace(SubmittedNotice))
            {
                errors.Add("SubmittedNotice is required");
            }
            if (!string.IsNullOrWhiteSpace(SubmittedNotice))
            {
                if (SubmittedNotice.Equals("other")) 
                {
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
                }               
            }
        }
        if (string.IsNullOrWhiteSpace(OrgRole))
        {
            errors.Add("OrgRole is required");
        }
        if (string.IsNullOrWhiteSpace(OrganisationName))
        {
            errors.Add("OrganisationName is required");
        }
        if (string.IsNullOrWhiteSpace(AboutIncident))
        {
            errors.Add("AboutIncident is required");
        }
        if (string.IsNullOrWhiteSpace(CauseOfIncident))
        {
            errors.Add("CauseOfIncident is required");
        }       
        if (string.IsNullOrWhiteSpace(WhoAffectedByIncident))
        {
            errors.Add("WhoAffectedByIncident is required");
        }       
        if (string.IsNullOrWhiteSpace(IncidentKeepPeopleSafe))
        {
            errors.Add("IncidentKeepPeopleSafe is required");
        }       
        if (string.IsNullOrWhiteSpace(OccurrenceDiscovered))
        {
            errors.Add("OccurrenceDiscovered is required");
        }
        if (string.IsNullOrWhiteSpace(SharedWithOthers))
        {
            errors.Add("SharedWithOthers is required");
        }
        if (IncidentReported is null)
        {
            errors.Add("IncidentReported is required");
        }
        if (IncidentReported is not null)
        {
            if (IncidentReported.Length <= 0)
            {
                errors.Add("IncidentReported is required");
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
