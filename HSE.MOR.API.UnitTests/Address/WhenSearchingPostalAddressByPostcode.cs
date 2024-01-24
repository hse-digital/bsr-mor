using HSE.MOR.API.Extensions;
using HSE.MOR.API.Functions;
using HSE.MOR.API.Models.OrdnanceSurvey;
using HSE.MOR.API.Models;
using HSE.MOR.API.Services;
using Microsoft.Extensions.Options;
using System.Net;
using Xunit;
using FluentAssertions;

namespace HSE.MOR.API.UnitTests.Address;

public class WhenSearchingPostalAddressByPostcode : UnitTestBase
{
    private readonly AddressFunctions addressFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string flatPostcode = "N227BW";

    public WhenSearchingPostalAddressByPostcode()
    {
        integrationsOptions = new IntegrationsOptions { CommonAPIEndpoint = "http://localhost:7126" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldCallPostcodeEndpoint()
    {
        HttpTest.RespondWithJson(BuildPostcodeResponseJson());

        await addressFunctions.SearchPostalAddressByPostcode(BuildHttpRequestData<object>(default, flatPostcode), flatPostcode);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.CommonAPIEndpoint}/api/SearchPostalAddressByPostcode/{flatPostcode}")
                .WithVerb(HttpMethod.Get);
    }

    private OrdnanceSurveyPostcodeResponse BuildPostcodeResponseJson()
    {
        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                offset = 0,
                totalresults = 1,
                maxresults = 100,
            },
            results = new List<Result>
            {
                new()
                {
                    DPA = new DPA
                    {
                        UPRN = "100021210108",
                        USRN = "15751415",
                        UDPRN = "15751415",
                        ADDRESS = "FLAT 1, 1, PALACE GATES ROAD, LONDON, N22 7BW",
                        SUB_BUILDING_NAME = "FLAT 1",
                        BUILDING_NUMBER = "1",
                        THOROUGHFARE_NAME = "PALACE GATES ROAD",
                        POST_TOWN = "LONDON",
                        POSTCODE = "N22 7BW",
                        RPC = "1",
                        X_COORDINATE = 530166.0,
                        Y_COORDINATE = 190531.0,
                        STATUS = "APPROVED",
                        LOGICAL_STATUS_CODE = "1",
                        CLASSIFICATION_CODE = "RD06",
                        CLASSIFICATION_CODE_DESCRIPTION = "Self Contained Flat (Includes Maisonette / Apartment)",
                        LOCAL_CUSTODIAN_CODE = 5420,
                        LOCAL_CUSTODIAN_CODE_DESCRIPTION = "LONDON BOROUGH OF HARINGEY",
                        COUNTRY_CODE = "E",
                        COUNTRY_CODE_DESCRIPTION = "This record is within England",
                        POSTAL_ADDRESS_CODE = "D",
                        POSTAL_ADDRESS_CODE_DESCRIPTION = "A record which is linked to PAF",
                        BLPU_STATE_CODE = "2",
                        BLPU_STATE_CODE_DESCRIPTION = "In use",
                        TOPOGRAPHY_LAYER_TOID = "osgb1000005604612",
                        PARENT_UPRN = "100023658485",
                        LAST_UPDATE_DATE = "16/05/2022",
                        ENTRY_DATE = "31/03/2004",
                        BLPU_STATE_DATE = "24/03/2004",
                        LANGUAGE = "EN",
                        MATCH = 1.0,
                        MATCH_DESCRIPTION = "EXACT",
                        DELIVERY_POINT_SUFFIX = "3Q"
                    }
                },
                new()
                {
                    DPA = new DPA
                    {
                        UPRN = "123123",
                        COUNTRY_CODE = "W",
                    }
                },
                new()
                {
                    DPA = new DPA
                    {
                        UPRN = "6666",
                        COUNTRY_CODE = "X",
                    }
                }
            }
        };
    }
}
