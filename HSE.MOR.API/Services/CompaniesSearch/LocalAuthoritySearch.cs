

using AutoMapper;
using HSE.MOR.API.Models;

namespace HSE.MOR.API.Services.CompaniesSearch;

public class LocalAuthoritySearch : ISearchCompany
{
    private readonly IDynamicsService dynamicsService;
    private readonly IMapper mapper;

    public LocalAuthoritySearch(IDynamicsService dynamicsService, IMapper mapper)
    {
        this.dynamicsService = dynamicsService;
        this.mapper = mapper;
    }

    public async Task<CompanySearchResponse> SearchCompany(string company)
    {
        var localAuthorityResponse = await dynamicsService.SearchLocalAuthorities(company);
        return mapper.Map<CompanySearchResponse>(localAuthorityResponse);
    }
}
