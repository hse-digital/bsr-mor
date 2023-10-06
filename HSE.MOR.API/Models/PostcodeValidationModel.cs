

namespace HSE.MOR.API.Models;

public record PostcodeValidationModel(string Postcode) : IValidatableModel
{
    
    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrEmpty(Postcode))
        {
            errors.Add("Postcode is not provided");
        }
        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
}
