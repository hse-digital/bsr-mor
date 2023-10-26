

namespace HSE.MOR.API.Models;

public record CaseNumberValidationModel(string CaseNumber) : IValidatableModel
{

    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrEmpty(CaseNumber))
        {
            errors.Add("Case Number is not provided");
        }
        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
}