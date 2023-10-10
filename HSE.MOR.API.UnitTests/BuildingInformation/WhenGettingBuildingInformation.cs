using FluentAssertions;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Functions;
using HSE.MOR.API.Models;
using HSE.MOR.API.Services;
using HSE.MOR.API.UnitTests.Helpers;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Moq;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Xunit;

namespace HSE.MOR.API.UnitTests.BuildingInformation;

public class WhenGettingBuildingInformation
{
    [Fact]
    public async Task WhenBuildingInformationIsReturnedNull()
    {
        //Arrange
        var testClass = new BuildingInformationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetBuildingInformationUsingPostcode_Async("null")).ReturnsAsync(value: null);
        var function = testClass.SUT();
        //Act       
        var postcodeRequestModel = new PostcodeValidationModel("null");
        var newRequest = testClass.BuildHttpRequestDataWithUri(postcodeRequestModel);
        var result = await function.GetBuildingInformationUsingPostcodeAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingInformation>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenBuildingInformationIsReturnedEmptyList()
    {
        //Arrange
        var testClass = new BuildingInformationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetBuildingInformationUsingPostcode_Async("Empty")).ReturnsAsync(new List<DynamicsBuildingInformation>());
        var function = testClass.SUT();
        //Act
        var postcodeRequestModel = new PostcodeValidationModel("Empty");
        var newRequest = testClass.BuildHttpRequestDataWithUri(postcodeRequestModel);
        var result = await function.GetBuildingInformationUsingPostcodeAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingInformation>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenBuildingInformationIsReturned()
    {
        //Arrange
        var testClass = new BuildingInformationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetBuildingInformationUsingPostcode_Async("SW1A 1AA")).ReturnsAsync(testClass.GetDynamicsBuildingInformation());
        var function = testClass.SUT();
        //Act
        var postcodeRequestModel = new PostcodeValidationModel("SW1A 1AA");
        var newRequest = testClass.BuildHttpRequestDataWithUri(postcodeRequestModel);
        var result = await function.GetBuildingInformationUsingPostcodeAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingInformation>>(result);
        response.Count.Should().Be(2);
    }

    [Fact]
    public async Task WhenBuildingInformationIsCorrect()
    {
        //Arrange
        var testClass = new BuildingInformationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetBuildingInformationUsingPostcode_Async("SW1A 1AA")).ReturnsAsync(testClass.GetDynamicsBuildingInformation());
        var function = testClass.SUT();
        //Act
        var postcodeRequestModel = new PostcodeValidationModel("SW1A 1AA");
        var newRequest = testClass.BuildHttpRequestDataWithUri(postcodeRequestModel);
        var result = await function.GetBuildingInformationUsingPostcodeAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingInformation>>(result);
        response.FirstOrDefault().bsr_postcode.Should().Be("SW1A 1AA");
    }

    [Fact]
    public async Task WhenBuildingInformationIsIncorrect()
    {
        //Arrange
        var testClass = new BuildingInformationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetBuildingInformationUsingPostcode_Async("WC1E 7JW")).ReturnsAsync(testClass.GetDynamicsBuildingInformationEmpty());
        var function = testClass.SUT();
        //Act
        var postcodeRequestModel = new PostcodeValidationModel("WC1E 7JW");
        var newRequest = testClass.BuildHttpRequestDataWithUri(postcodeRequestModel);
        var result = await function.GetBuildingInformationUsingPostcodeAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingInformation>>(result);
        response.FirstOrDefault().bsr_postcode.Should().NotBe("SW1A 1AA");
    }

    public class BuildingInformationFunctionTestClass
    {
        public Mock<IDynamicsService> DynamicsService { get; } = new();
        public Mock<ILogger<BuildingInformationFunction>> Logger { get; } = new();

        public BuildingInformationFunction SUT() => new(this.DynamicsService.Object, Logger.Object);

        public TestableHttpRequestData BuildHttpRequestDataWithUri(PostcodeValidationModel data)
        {
            var functionContext = new Mock<FunctionContext>();

            var memoryStream = new MemoryStream();
            JsonSerializer.Serialize(memoryStream, data);

            memoryStream.Flush();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new TestableHttpRequestData(functionContext.Object, new Uri("http://dynamics.com"), memoryStream);
        }
        public List<DynamicsBuildingInformation> GetDynamicsBuildingInformationEmpty()
        {
            return new List<DynamicsBuildingInformation> {

                new DynamicsBuildingInformation
                {
                    bsr_blockid = null,                  
                    bsr_uprn = "Empty",
                    bsr_usrn = null,
                    bsr_name = null,
                    bsr_addressline1 = null,
                    bsr_city = null,
                    bsr_postcode = "WC1E 7JW",
                    
                }
            };
        }
        public List<DynamicsBuildingInformation> GetDynamicsBuildingInformation()
        {

            return new List<DynamicsBuildingInformation> {

                new DynamicsBuildingInformation
                {
                    bsr_blockid = null,                 
                    bsr_uprn = "100023619154",
                    bsr_usrn = null,
                    bsr_name = "Test_1",
                    bsr_addressline1 = null,
                    bsr_city = null,
                    bsr_postcode = "SW1A 1AA",                    
                },
                new DynamicsBuildingInformation
                {
                    bsr_blockid = null,                  
                    bsr_uprn = "100023619154",
                    bsr_usrn = null,
                    bsr_name = "Test_2",
                    bsr_addressline1 = null,
                    bsr_city = null,
                    bsr_postcode = "SW1A 1AA",
                    
                }
            };
        }
    }
}
