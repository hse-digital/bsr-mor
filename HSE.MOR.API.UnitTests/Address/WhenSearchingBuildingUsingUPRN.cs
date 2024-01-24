﻿using HSE.MOR.API.Extensions;
using HSE.MOR.API.Functions;
using HSE.MOR.API.Models.OrdnanceSurvey;
using HSE.MOR.API.Models;
using HSE.MOR.API.Services;
using Microsoft.Extensions.Options;
using System.Net;
using Xunit;
using FluentAssertions;

namespace HSE.MOR.API.UnitTests.Address;

public class WhenSearchingBuildingUsingUPRN : UnitTestBase
{
    private readonly AddressFunctions addressFunctions;
    private readonly IntegrationsOptions integrationsOptions;
    private const string testUprn = "10033544614";

    public WhenSearchingBuildingUsingUPRN()
    {
        integrationsOptions = new IntegrationsOptions { OrdnanceSurveyEndpoint = "https://api.os.uk/search/places/v1", OrdnanceSurveyApiKey = "abc123" };
        addressFunctions = new AddressFunctions(new OptionsWrapper<IntegrationsOptions>(integrationsOptions), GetMapper());
    }

    [Fact]
    public async Task ShouldCallUPRNEndpoint()
    {
        HttpTest.RespondWithJson(BuildPostcodeResponseJson());

        await addressFunctions.SearchBuildingAddressByUPRN(BuildHttpRequestData<object>(default, testUprn), testUprn);

        HttpTest.ShouldHaveCalled($"{integrationsOptions.OrdnanceSurveyEndpoint}/uprn")
            .WithQueryParams(new
            {
                uprn = testUprn,
                dataset = "LPI",
                fq = new[] { "CLASSIFICATION_CODE:PP CLASSIFICATION_CODE:P", "COUNTRY_CODE:E" },
                key = integrationsOptions.OrdnanceSurveyApiKey
            })
            .WithVerb(HttpMethod.Get);
    }

    [Fact]
    public async Task ShouldReturnMatchingAddresses()
    {
        var postcodeResponse = BuildPostcodeResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchBuildingAddressByUPRN(BuildHttpRequestData<object>(default, testUprn), testUprn);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(1);

        responseAddress.Results[0].UPRN.Should().Be(postcodeResponse.results[0].LPI.UPRN);
        responseAddress.Results[0].USRN.Should().Be(postcodeResponse.results[0].LPI.USRN);
        responseAddress.Results[0].Address.Should().Be(postcodeResponse.results[0].LPI.ADDRESS);
        responseAddress.Results[0].Number.Should().Be(postcodeResponse.results[0].LPI.PAO_START_NUMBER);
        responseAddress.Results[0].BuildingName.Should().Be(postcodeResponse.results[0].LPI.PAO_TEXT);
        responseAddress.Results[0].Street.Should().Be(postcodeResponse.results[0].LPI.STREET_DESCRIPTION);
        responseAddress.Results[0].Town.Should().Be(postcodeResponse.results[0].LPI.TOWN_NAME);
        responseAddress.Results[0].Country.Should().Be(postcodeResponse.results[0].LPI.COUNTRY_CODE);
        responseAddress.Results[0].AdministrativeArea.Should().Be(postcodeResponse.results[0].LPI.ADMINISTRATIVE_AREA);
        responseAddress.Results[0].Postcode.Should().Be(postcodeResponse.results[0].LPI.POSTCODE_LOCATOR);
    }

    [Fact]
    public async Task ShouldReturnEmptyResultsIfPostcodeIsNotFound()
    {
        HttpTest.RespondWith(status: (int)HttpStatusCode.BadRequest);

        var response = await addressFunctions.SearchBuildingAddressByUPRN(BuildHttpRequestData<object>(default, "invalid"), "invalid");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();
        responseAddress.MaxResults.Should().Be(0);
        responseAddress.Offset.Should().Be(0);
        responseAddress.TotalResults.Should().Be(0);
        responseAddress.Results.Should().BeEmpty();
    }

    [Fact]
    public async Task ShouldFilterResultsThatAreNotEngland()
    {
        var postcodeResponse = BuildPostcodeResponseJson();
        HttpTest.RespondWithJson(postcodeResponse);

        var response = await addressFunctions.SearchBuildingAddressByUPRN(BuildHttpRequestData<object>(default, testUprn), testUprn);
        var responseAddress = await response.ReadAsJsonAsync<BuildingAddressSearchResponse>();

        responseAddress.MaxResults.Should().Be(postcodeResponse.header.maxresults);
        responseAddress.Offset.Should().Be(postcodeResponse.header.offset);
        responseAddress.TotalResults.Should().Be(1);

        responseAddress.Results.Any(x => x.Country is not "E").Should().BeFalse();
    }

    private OrdnanceSurveyPostcodeResponse BuildPostcodeResponseJson()
    {
        return new OrdnanceSurveyPostcodeResponse
        {
            header = new Header
            {
                offset = 0,
                totalresults = 3,
                maxresults = 100,
            },
            results = new List<Result>
            {
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "10033544614",
                        ADDRESS = "BUCKINGHAM PALACE, THE MALL, LONDON, CITY OF WESTMINSTER, SW1A 1AA",
                        USRN = "8401058",
                        LPI_KEY = "5990L 000016069",
                        PAO_TEXT = "BUCKINGHAM PALACE",
                        PAO_START_NUMBER = "123",
                        STREET_DESCRIPTION = "THE MALL",
                        TOWN_NAME = "LONDON",
                        COUNTRY_CODE = "E",
                        ADMINISTRATIVE_AREA = "CITY OF WESTMINSTER",
                        POSTCODE_LOCATOR = "SW1A 1AA",
                        STATUS = "APPROVED",
                        LOGICAL_STATUS_CODE = "1",
                        CLASSIFICATION_CODE = "PP",
                        CLASSIFICATION_CODE_DESCRIPTION = "Property Shell",
                        LOCAL_CUSTODIAN_CODE = 5990,
                        LOCAL_CUSTODIAN_CODE_DESCRIPTION = "CITY OF WESTMINSTER",
                        MATCH = 1.0,
                    }
                },
                new()
                {
                    LPI = new LPI
                    {
                        UPRN = "66666",
                        COUNTRY_CODE = "X",
                    }
                }
            }
        };
    }
}
