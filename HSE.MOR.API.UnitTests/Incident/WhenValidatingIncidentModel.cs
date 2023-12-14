using FluentAssertions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.TestingCommon;
using Xunit;

namespace HSE.MOR.API.UnitTests.Incident;

public class WhenValidatingIncidentModel
{
    [Fact]
    public void ShouldReturnNoErrorsWhenModelIsInValid()
    {
        var model = new CaseModelBuilder().Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().NotBeEmpty();
    }

    [Theory]
    [MemberData(nameof(ValidationNoticeCases))]
    public void ShouldValidateNoticeCaseFields(NoticeModel model, string errorMessage)
    {
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain(errorMessage);
    }

    [Theory]
    [MemberData(nameof(ValidationReportCases))]
    public void ShouldValidateReportCaseFields(ReportModel model, string errorMessage)
    {
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain(errorMessage);
    }

    [Theory]
    [InlineData("07700900982", true)]
    [InlineData("07700 900 982", true)]
    [InlineData("+448081570192", true)]
    [InlineData("+44 808 157 0192", true)]
    [InlineData("01632960001", true)]
    [InlineData("01632 960 001", true)]
    [InlineData("+55123123", false)]
    [InlineData("+0124123123", false)]
    [InlineData("+44 808 157 0192 33", false)]
    public void ShouldValidatePhoneNumberFormat(string phoneNumber, bool isValid)
    {
        var model = new NoticeModelBuilder().WithContactNumber(phoneNumber).Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().Be(isValid);
        if (!isValid)
        {
            validationResult.Errors.Should().Contain("You must enter a UK telephone number. For example, 01632 960 001, 07700 900 982 or +44 808 157 0192");
        }
    }

    [Theory]
    [MemberData(nameof(ValidationNoticeCases))]
    public void ShouldValidateCasesFields(NoticeModel model, string errorMessage)
    {
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeFalse();
        validationResult.Errors.Should().Contain(errorMessage);
    }

    [Theory]
    [InlineData("ignasdi@codec.ie", true)]
    [InlineData("ignas.di@test.co.uk", true)]
    [InlineData("mr.ignas.di@test.co.uk", true)]
    [InlineData("mr.ignas.di55@test.co.uk", true)]
    [InlineData("ignas@codec", true)]
    [InlineData("ignas.codec.ie", false)]
    [InlineData("ignas", false)]
    [InlineData("ignas:ignas@codec.ie", false)]
    [InlineData("ignas@ignas@codec.ie", false)]
    public void ShouldValidateEmailFormat(string email, bool isValid)
    {
        var model = new CaseModelBuilder().WithEmailAddress(email).Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().Be(isValid);
        if (!isValid)
        {
            validationResult.Errors.Should().Contain("You must enter an email address in the correct format, like name@example.com");
        }
    }

    public static IEnumerable<object[]> ValidationNoticeCases()
    {

        // first name
        yield return new object[] { new NoticeModelBuilder().WithFirstName("").Build(), "FirstName is required" };
        yield return new object[] { new NoticeModelBuilder().WithFirstName(" ").Build(), "FirstName is required" };
        yield return new object[] { new NoticeModelBuilder().WithFirstName(default).Build(), "FirstName is required" };

        // last name
        yield return new object[] { new NoticeModelBuilder().WithLastName("").Build(), "LastName is required" };
        yield return new object[] { new NoticeModelBuilder().WithLastName(" ").Build(), "LastName is required" };
        yield return new object[] { new NoticeModelBuilder().WithLastName(default).Build(), "LastName is required" };

        // phone number
        yield return new object[] { new NoticeModelBuilder().WithContactNumber("").Build(), "ContactNumber is required" };
        yield return new object[] { new NoticeModelBuilder().WithContactNumber(" ").Build(), "ContactNumber is required" };
        yield return new object[] { new NoticeModelBuilder().WithContactNumber(default).Build(), "ContactNumber is required" };

        //when become aware datetime model
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(default).Build(), "WhenBecomeAware is required" };
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(new Domain.Entities.TimeModel { Year = "", Month = "10", Day = "10", Hour = "10", Minute = "10" }).Build(), "WhenBecomeAware Year is required" };
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(new Domain.Entities.TimeModel { Year = "2021", Month = "", Day = "10", Hour = "10", Minute = "10" }).Build(), "WhenBecomeAware Month is required" };
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(new Domain.Entities.TimeModel { Year = "2021", Month = "10", Day = "", Hour = "10", Minute = "10" }).Build(), "WhenBecomeAware Day is required" };
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(new Domain.Entities.TimeModel { Year = "2021", Month = "10", Day = "10", Hour = "", Minute = "10" }).Build(), "WhenBecomeAware Hour is required" };
        yield return new object[] { new NoticeModelBuilder().WithTimeModel(new Domain.Entities.TimeModel { Year = "2021", Month = "10", Day = "10", Hour = "10", Minute = "" }).Build(), "WhenBecomeAware Minute is required" };

    }

    public static IEnumerable<object[]> ValidationReportCases()
    {
        //first name
        yield return new object[] { new ReportModelBuilder().WithFirstName("").Build(), "FirstName is required" };
        yield return new object[] { new ReportModelBuilder().WithFirstName(" ").Build(), "FirstName is required" };
        yield return new object[] { new ReportModelBuilder().WithFirstName(default).Build(), "FirstName is required" };

        //last name
        yield return new object[] { new ReportModelBuilder().WithLastName("").Build(), "LastName is required" };
        yield return new object[] { new ReportModelBuilder().WithLastName(" ").Build(), "LastName is required" };
        yield return new object[] { new ReportModelBuilder().WithLastName(default).Build(), "LastName is required" };

        //phone number
        yield return new object[] { new ReportModelBuilder().WithContactNumber("").Build(), "ContactNumber is required" };
        yield return new object[] { new ReportModelBuilder().WithContactNumber(" ").Build(), "ContactNumber is required" };
        yield return new object[] { new ReportModelBuilder().WithContactNumber(default).Build(), "ContactNumber is required" };

        //submitted notice
        yield return new object[] { new ReportModelBuilder().WithSubmittedNotice("").Build(), "SubmittedNotice is required" };
        yield return new object[] { new ReportModelBuilder().WithSubmittedNotice(" ").Build(), "SubmittedNotice is required" };
        yield return new object[] { new ReportModelBuilder().WithSubmittedNotice(default).Build(), "SubmittedNotice is required" };

        //organisaton role
        yield return new object[] { new ReportModelBuilder().WithOrgRole("").Build(), "OrgRole is required" };
        yield return new object[] { new ReportModelBuilder().WithOrgRole(" ").Build(), "OrgRole is required" };
        yield return new object[] { new ReportModelBuilder().WithOrgRole(default).Build(), "OrgRole is required" };

        //organisaton name
        yield return new object[] { new ReportModelBuilder().WithOrganisationName("").Build(), "OrganisationName is required" };
        yield return new object[] { new ReportModelBuilder().WithOrganisationName(" ").Build(), "OrganisationName is required" };
        yield return new object[] { new ReportModelBuilder().WithOrganisationName(default).Build(), "OrganisationName is required" };

        //about incident
        yield return new object[] { new ReportModelBuilder().WithAboutIncident("").Build(), "AboutIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithAboutIncident(" ").Build(), "AboutIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithAboutIncident(default).Build(), "AboutIncident is required" };

        //cause of incident
        yield return new object[] { new ReportModelBuilder().WithCauseOfIncident("").Build(), "CauseOfIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithCauseOfIncident(" ").Build(), "CauseOfIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithCauseOfIncident(default).Build(), "CauseOfIncident is required" };

        //who affected by incident
        yield return new object[] { new ReportModelBuilder().WithWhoAffectedByIncident("").Build(), "WhoAffectedByIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithWhoAffectedByIncident(" ").Build(), "WhoAffectedByIncident is required" };
        yield return new object[] { new ReportModelBuilder().WithWhoAffectedByIncident(default).Build(), "WhoAffectedByIncident is required" };

        //incident keep people safe
        yield return new object[] { new ReportModelBuilder().WithIncidentKeepPeopleSafe("").Build(), "IncidentKeepPeopleSafe is required" };
        yield return new object[] { new ReportModelBuilder().WithIncidentKeepPeopleSafe(" ").Build(), "IncidentKeepPeopleSafe is required" };
        yield return new object[] { new ReportModelBuilder().WithIncidentKeepPeopleSafe(default).Build(), "IncidentKeepPeopleSafe is required" };

        //occurrence discovered
        yield return new object[] { new ReportModelBuilder().WithOccurrenceDiscovered("").Build(), "OccurrenceDiscovered is required" };
        yield return new object[] { new ReportModelBuilder().WithOccurrenceDiscovered(" ").Build(), "OccurrenceDiscovered is required" };
        yield return new object[] { new ReportModelBuilder().WithOccurrenceDiscovered(default).Build(), "OccurrenceDiscovered is required" };

        //shared with others
        yield return new object[] { new ReportModelBuilder().WithSharedWithOthers("").Build(), "SharedWithOthers is required" };
        yield return new object[] { new ReportModelBuilder().WithSharedWithOthers(" ").Build(), "SharedWithOthers is required" };
        yield return new object[] { new ReportModelBuilder().WithSharedWithOthers(default).Build(), "SharedWithOthers is required" };
    }
}
