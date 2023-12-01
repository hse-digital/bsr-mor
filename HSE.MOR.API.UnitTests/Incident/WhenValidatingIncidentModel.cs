using FluentAssertions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.TestingCommon;
using Xunit;

namespace HSE.MOR.API.UnitTests.Incident;

public class WhenValidatingIncidentModel
{
    [Fact]
    public void ShouldReturnNoErrorsWhenModelIsValid()
    {
        var model = new CaseModelBuilder().Build();
        var validationResult = model.Validate();

        validationResult.IsValid.Should().BeTrue();
        validationResult.Errors.Should().BeEmpty();
    }

    [Theory]
    [MemberData(nameof(ValidationNoticeCases))]
    public void ShouldValidateContactCaseFields(NoticeModel model, string errorMessage)
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
        yield return new object[] { new NoticeModelBuilder().WithFirstName("").Build(), "Contact first name is required" };
        yield return new object[] { new NoticeModelBuilder().WithFirstName(" ").Build(), "Contact first name is required" };
        yield return new object[] { new NoticeModelBuilder().WithFirstName(default).Build(), "Contact first name is required" };

        // last name
        yield return new object[] { new NoticeModelBuilder().WithLastName("").Build(), "Contact last name is required" };
        yield return new object[] { new NoticeModelBuilder().WithLastName(" ").Build(), "Contact last name is required" };
        yield return new object[] { new NoticeModelBuilder().WithLastName(default).Build(), "Contact last name is required" };

        // phone number and email
        yield return new object[] { new NoticeModelBuilder().WithContactNumber("").Build(), "Contact number or email is required" };
        yield return new object[] { new NoticeModelBuilder().WithContactNumber(" ").Build(), "Contact number or email is required" };
        yield return new object[] { new NoticeModelBuilder().WithContactNumber(default).Build(), "Contact number or email is required" };

    } 
}
