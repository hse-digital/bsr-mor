

using System.Text.Json.Serialization;

namespace HSE.MOR.API.Models.Notifications;

public class EmailNotificationRequest
{
    [JsonPropertyName("email_address")]
    public string email_address { get; set; }

    [JsonPropertyName("template_id")]
    public string template_id { get; set; }

    [JsonPropertyName("personalisation")]
    public Dictionary<string, dynamic> personalisation { get; set; }
}
