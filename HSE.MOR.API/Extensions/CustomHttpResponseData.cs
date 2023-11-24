

using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;

namespace HSE.MOR.API.Extensions;

public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "building-control-applications", Connection = "CosmosConnection")]
    public object Application { get; set; }
    public HttpResponseData HttpResponse { get; set; }
}
