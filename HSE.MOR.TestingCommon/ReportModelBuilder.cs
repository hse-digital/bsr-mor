

using HSE.MOR.API.Models.Dynamics;

namespace HSE.MOR.TestingCommon;

public class ReportModelBuilder
{
    private string modelFirstName = "building_or_person";
    private string modelLastName = "building_or_person";
    private string modelContactNumber = "+441111111111";
    private string modelAboutIncident = "building_or_person";
    private string modelCauseOfIncident = "building_or_person";
    private string modelOrganisationName = "building_or_person";
    private string modelOrgRole = "building_or_person";
    private string modelOccurrenceDiscovered = "building_or_person";
    private string modelIncidentKeepPeopleSafe = "building_or_person";
    private string modelNoticeReference = "building_or_person";
    private string modelSharedWithOthers = "building_or_person";
    private string modelSubmittedNotice = "other";
    private string modelWhoAffectedByIncident = "building_or_person";
    private string modelYourSupportInfo = "building_or_person";
    private string[] modelIncidentReported = new string[] { "incident" };


    public ReportModelBuilder WithFirstName(string firstName)
    {
        modelFirstName = firstName;
        return this;
    }
    public ReportModelBuilder WithLastName(string lastName)
    {
        modelLastName = lastName;
        return this;
    }
    public ReportModelBuilder WithAboutIncident(string aboutIncident)
    {
        modelAboutIncident = aboutIncident;
        return this;
    }
    public ReportModelBuilder WithContactNumber(string contactNumber)
    {
        modelContactNumber = contactNumber;
        return this;
    }
    public ReportModelBuilder WithCauseOfIncident(string causeOfIncident)
    {
        modelCauseOfIncident = causeOfIncident;
        return this;
    }
    public ReportModelBuilder WithOrganisationName(string organisationName)
    {
        modelOrganisationName = organisationName;
        return this;
    }

    public ReportModelBuilder WithOrgRole(string orgRole)
    {
        modelOrgRole = orgRole;
        return this;
    }
    public ReportModelBuilder WithOccurrenceDiscovered(string occurrenceDiscovered)
    {
        modelOccurrenceDiscovered = occurrenceDiscovered;
        return this;
    }
    public ReportModelBuilder WithIncidentKeepPeopleSafe(string incidentKeepPeopleSafe)
    {
        modelIncidentKeepPeopleSafe = incidentKeepPeopleSafe;
        return this;
    }
    public ReportModelBuilder WithNoticeReference(string noticeReference)
    {
        modelNoticeReference = noticeReference;
        return this;
    }
    public ReportModelBuilder WithSharedWithOthers(string sharedWithOthers)
    {
        modelSharedWithOthers = sharedWithOthers;
        return this;
    }
    public ReportModelBuilder WithSubmittedNotice(string submittedNotice)
    {
        modelSubmittedNotice = submittedNotice;
        return this;
    }
    public ReportModelBuilder WithWhoAffectedByIncident(string whoAffectedByIncident)
    {
        modelWhoAffectedByIncident = whoAffectedByIncident;
        return this;
    }
    public ReportModelBuilder WithYourSupportInfo(string yourSupportInfo)
    {
        modelYourSupportInfo = yourSupportInfo;
        return this;
    }

    public ReportModelBuilder WithIncidentReported(string[] incidentReported)
    {
        modelIncidentReported = incidentReported;
        return this;
    }

    public ReportModel Build()
    {
        var model = new ReportModel();
        model.FirstName = modelFirstName;
        model.LastName = modelLastName;
        model.ContactNumber = modelContactNumber;
        model.AboutIncident = modelAboutIncident;
        model.CauseOfIncident = modelCauseOfIncident;
        model.OrganisationName = modelOrganisationName;
        model.OrgRole = modelOrgRole;
        model.OccurrenceDiscovered = modelOccurrenceDiscovered;
        model.IncidentKeepPeopleSafe = modelIncidentKeepPeopleSafe;
        model.NoticeReference = modelNoticeReference;
        model.SharedWithOthers = modelSharedWithOthers;
        model.SubmittedNotice = modelSubmittedNotice;
        model.WhoAffectedByIncident = modelWhoAffectedByIncident;
        model.YourSupportInfo = modelYourSupportInfo;
        model.IncidentReported = modelIncidentReported;
        return model;
    }
}
