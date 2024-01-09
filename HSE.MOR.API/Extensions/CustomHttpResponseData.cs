

using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;

namespace HSE.MOR.API.Extensions;

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "mor-case-submission", Connection = "CosmosConnection")]
    public object Application { get; set; }
    public HttpResponseData HttpResponse { get; set; }
}
