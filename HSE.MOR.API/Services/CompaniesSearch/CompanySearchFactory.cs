

using AutoMapper;
using Microsoft.Extensions.Options;

namespace HSE.MOR.API.Services.CompaniesSearch;

public class CompanySearchFactory
{
    private readonly IMapper mapper;
    private readonly IntegrationsOptions integrationsOptions;
    private readonly IDynamicsService dynamicsService;

    public CompanySearchFactory(IOptions<IntegrationsOptions> integrationsOptions, IDynamicsService dynamicsService, IMapper mapper)
    {
        this.mapper = mapper;
        this.dynamicsService = dynamicsService;
        this.integrationsOptions = integrationsOptions.Value;
    }

    public ISearchCompany GetSearchCompanyInstance(string companyType)
    {
        return companyType switch
        {
            "company" => new CompaniesHouseSearch(integrationsOptions, mapper),
            "local-authority" => new LocalAuthoritySearch(dynamicsService, mapper),
            "housing-association" => new SocialHousingSearch(dynamicsService, mapper),
            _ => null
        };      
    }
}