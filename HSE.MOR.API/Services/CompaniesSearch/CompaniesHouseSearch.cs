

using AutoMapper;
using Flurl;
using HSE.MOR.API.Models.CompaniesHouse;
using HSE.MOR.API.Models;
using System.Net;
using Flurl.Http;

namespace HSE.MOR.API.Services.CompaniesSearch;

public class CompaniesHouseSearch : ISearchCompany
{
    private readonly IntegrationsOptions integrationsOptions;
    private readonly IMapper mapper;

    public CompaniesHouseSearch(IntegrationsOptions integrationsOptions, IMapper mapper)
    {
        this.integrationsOptions = integrationsOptions;
        this.mapper = mapper;
    }

    public async Task<CompanySearchResponse> SearchCompany(string company)
    {
        var response = await integrationsOptions.CompaniesHouseEndpoint
            .AppendPathSegments("advanced-search", "companies")
            .SetQueryParam("company_name_includes", company)
            .WithBasicAuth(integrationsOptions.CompaniesHouseApiKey, string.Empty)
            .AllowHttpStatus(HttpStatusCode.NotFound)
            .GetAsync();

        if (response.StatusCode == (int)HttpStatusCode.NotFound)
        {
            return new CompanySearchResponse();
        }

        var companies = await response.GetJsonAsync<CompaniesHouseSearchResponse>();
        return mapper.Map<CompanySearchResponse>(companies);
    }
}
