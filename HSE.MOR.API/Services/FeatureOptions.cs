
namespace HSE.MOR.API.Services;

public class FeatureOptions
{
    public const string Feature = nameof(Feature);

    public bool DisableOtpValidation { get; set; }
    public bool AllowTestFile { get; set; }
    public string TestFileName { get; set; } = string.Empty;
}
