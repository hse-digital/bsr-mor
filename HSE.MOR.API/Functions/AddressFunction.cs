using AutoMapper;
using Flurl.Http;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Options;
using System.Net;
using HSE.MOR.API.Models;
using HSE.MOR.API.Models.OrdnanceSurvey;
using HSE.MOR.API.Extensions;
using Flurl;

namespace HSE.MOR.API.Functions;

public class AddressFunctions
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationOptions;

    public AddressFunctions(IOptions<IntegrationsOptions> integrationOptions, IMapper mapper)
    {
        this.mapper = mapper;
        this.integrationOptions = integrationOptions.Value;
    }

    [Function(nameof(SearchBuildingByPostcode))]
    public async Task<HttpResponseData> SearchBuildingByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchBuildingByPostcode)}/{{postcode}}")] HttpRequestData request, string postcode)
    {
        try
        {
            var resp = await integrationOptions.CommonAPIEndpoint
                .AppendPathSegment("api")
                .AppendPathSegment(nameof(SearchBuildingByPostcode))
                .AppendPathSegment(postcode)
                .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
                .AllowHttpStatus(HttpStatusCode.BadRequest)
                .GetAsync();

            var stream = await resp.GetStreamAsync();

            return await request.CreateObjectResponseFromStreamAsync(stream);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    [Function(nameof(SearchPostalAddress_LPI_ByPostcode))]
    public async Task<HttpResponseData> SearchPostalAddress_LPI_ByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchPostalAddress_LPI_ByPostcode)}/{{postcode}}")] HttpRequestData request, string postcode)
    {
        var response = await GetDataFromOrdnanceSurvey("postcode", new
        {
            postcode = postcode,
            dataset = "LPI",
            key = integrationOptions.OrdnanceSurveyApiKey
        });
        return await BuildResponseObjectAsync(request, response);
    }

    [Function(nameof(SearchPostalAddressByPostcode))]
    public async Task<HttpResponseData> SearchPostalAddressByPostcode([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchPostalAddressByPostcode)}/{{postcode}}")] HttpRequestData request, string postcode)
    {
        try
        {
            var resp = await integrationOptions.CommonAPIEndpoint
                .AppendPathSegment("api")
                .AppendPathSegment(nameof(SearchPostalAddressByPostcode))
                .AppendPathSegment(postcode)
                .WithHeader("x-functions-key", integrationOptions.CommonAPIKey)
                .AllowHttpStatus(HttpStatusCode.BadRequest)
                .GetAsync();

            var stream = await resp.GetStreamAsync();

            return await request.CreateObjectResponseFromStreamAsync(stream);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw;
        }
    }

    [Function(nameof(SearchBuildingAddressByUPRN))]
    public async Task<HttpResponseData> SearchBuildingAddressByUPRN([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchBuildingAddressByUPRN)}/{{uprn}}")] HttpRequestData request, string uprn)
    {
        var response = await GetDataFromOrdnanceSurvey("uprn", new
        {
            uprn = uprn,
            dataset = "LPI",
            fq = new[] { "CLASSIFICATION_CODE:PP CLASSIFICATION_CODE:P", "COUNTRY_CODE:E" },
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObjectAsync(request, response);
    }

    [Function(nameof(SearchAddress))]
    public async Task<HttpResponseData> SearchAddress([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = $"{nameof(SearchAddress)}/{{query}}")] HttpRequestData request, string query)
    {
        var response = await GetDataFromOrdnanceSurvey("find", new
        {
            query = query,
            dataset = "LPI,DPA",
            minmatch = 0.5,
            key = integrationOptions.OrdnanceSurveyApiKey
        });

        return await BuildResponseObjectAsync(request, response);
    }

    private async Task<HttpResponseData> BuildResponseObjectAsync(HttpRequestData request, IFlurlResponse response)
    {
        var searchResponse = await GetSearchResponseAsync(response);
        return await request.CreateObjectResponseAsync(searchResponse);
    }

    private async Task<BuildingAddressSearchResponse> GetSearchResponseAsync(IFlurlResponse response)
    {
        BuildingAddressSearchResponse searchResponse;
        if (response.StatusCode == (int)HttpStatusCode.BadRequest)
        {
            searchResponse = new BuildingAddressSearchResponse { Results = Array.Empty<BuildingAddress>() };
        }
        else
        {
            var postcodeResponse = await response.GetJsonAsync<OrdnanceSurveyPostcodeResponse>();
            var englandAndWalesResponse = GetEnglandOrWalesResponses(postcodeResponse);
            searchResponse = mapper.Map<BuildingAddressSearchResponse>(englandAndWalesResponse);
        }

        return searchResponse;
    }

    private Task<IFlurlResponse> GetDataFromOrdnanceSurvey(string endpoint, object queryParams)
    {
        return integrationOptions.OrdnanceSurveyEndpoint
            .AppendPathSegment(endpoint)
            .SetQueryParams(queryParams)
            .AllowHttpStatus(HttpStatusCode.BadRequest)
            .GetAsync();
    }

    private OrdnanceSurveyPostcodeResponse GetEnglandOrWalesResponses(OrdnanceSurveyPostcodeResponse postcodeResponse)
    {
        var eOrW = postcodeResponse.results?.Where(x => x.LPI?.COUNTRY_CODE is "E" or "W" || x.DPA?.COUNTRY_CODE is "E" or "W").ToList() ?? new List<Result>();

        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                maxresults = postcodeResponse.header.maxresults,
                offset = postcodeResponse.header.offset,
                totalresults = eOrW.Count
            },
            results = eOrW
        };
    }
}
public class CustomHttpResponseData
{
    [CosmosDBOutput("hseportal", "case-submission", Connection = "CosmosConnection")]
    public object Application { get; set; }

    public HttpResponseData HttpResponse { get; set; }
}
