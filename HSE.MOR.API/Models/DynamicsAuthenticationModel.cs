using System.Text.Json.Serialization;

namespace HSE.MOR.API.Models;

public class DynamicsAuthenticationModel
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
}
