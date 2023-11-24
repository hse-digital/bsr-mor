using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using System.Collections.Specialized;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Extensions;

public static class HttpRequestDataExtensions
{
    public static async Task<T> ReadAsJsonAsync<T>(this HttpRequestData httpRequestData)
    {
        var requestContent = await httpRequestData.ReadAsStringAsync();
        requestContent = requestContent!.Replace("&39", "'");

        return JsonSerializer.Deserialize<T>(requestContent);
    }

    public static async Task<T> ReadAsJsonAsync<T>(this HttpResponseData httpRequestData)
    {
        return await JsonSerializer.DeserializeAsync<T>(httpRequestData.Body);
    }

    public static async Task<T> ReadAsJsonAsync<T>(this HSE.MOR.API.Functions.CustomHttpResponseData customHttpRequestData)
    {
        return await JsonSerializer.DeserializeAsync<T>(customHttpRequestData.HttpResponse.Body);
    }

    public static async Task<HttpResponseData> CreateObjectResponseAsync<T>(this HttpRequestData httpRequestData, T @object)
    {
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, @object);

        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        var response = httpRequestData.CreateResponse(HttpStatusCode.OK);
        response.Body = stream;

        return response;
    }

    public static async Task<HttpResponseData> BuildValidationErrorResponseDataAsync(this HttpRequestData httpRequestData, ValidationSummary validationSummary)
    {
        var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, validationSummary);

        stream.Flush();
        stream.Seek(0, SeekOrigin.Begin);

        var badRequestResponse = httpRequestData.CreateResponse(HttpStatusCode.BadRequest);
        badRequestResponse.Body = stream;

        return badRequestResponse;
    }

    public static NameValueCollection GetQueryParameters(this HttpRequestData request)
    {
        return System.Web.HttpUtility.ParseQueryString(request.Url.Query);
    }
}
