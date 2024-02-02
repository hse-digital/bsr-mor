

using HSE.MOR.API.Models;

namespace HSE.MOR.API.Services.CompaniesSearch;

public interface ISearchCompany
{
    Task<CompanySearchResponse> SearchCompany(string company);
}
