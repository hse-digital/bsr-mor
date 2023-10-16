
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
using System.Text.Json;
using Xunit;

namespace HSE.MOR.API.UnitTests.BuildingDetails;

public class WhenGettingBuildingDetails
{
    [Fact]
    public async Task WhenBuildingDetailsIsReturnedNull()
    {
        //Arrange
        var testClass = new BuildingDetailsFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsBuildingDetailsUsingBcaReference_Async("null")).ReturnsAsync(value: null);
        var function = testClass.SUT();
        //Act       
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsBuildingDetailsByBcaReferenceAsync(newRequest, "null");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingDetails>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenBuildingDetailsIsReturnedEmptyList()
    {
        //Arrange
        var testClass = new BuildingDetailsFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsBuildingDetailsUsingBcaReference_Async("Empty")).ReturnsAsync(new List<DynamicsBuildingDetails>());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsBuildingDetailsByBcaReferenceAsync(newRequest, "Empty");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingDetails>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenBuildingDetailsIsReturned()
    {
        //Arrange
        var testClass = new BuildingDetailsFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsBuildingDetailsUsingBcaReference_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetails());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsBuildingDetailsByBcaReferenceAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingDetails>>(result);
        response.Count.Should().Be(2);
    }

    [Fact]
    public async Task WhenBuildingDetailsIsCorrect()
    {
        //Arrange
        var testClass = new BuildingDetailsFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsBuildingDetailsUsingBcaReference_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetails());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsBuildingDetailsByBcaReferenceAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingDetails>>(result);
        response.FirstOrDefault().bsr_address1_postalcode.Should().Be("SW1A 1AA");
    }

    [Fact]
    public async Task WhenBuildingDetailsIsIncorrect()
    {
        //Arrange
        var testClass = new BuildingDetailsFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsBuildingDetailsUsingBcaReference_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetailsEmpty());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsBuildingDetailsByBcaReferenceAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsBuildingDetails>>(result);
        response.FirstOrDefault().bsr_address1_postalcode.Should().NotBe("SW1A 1AA");
    }

    public class BuildingDetailsFunctionTestClass
    {
        public Mock<IDynamicsService> DynamicsService { get; } = new();
        public Mock<ILogger<BuildingControlApplicationFunction>> Logger { get; } = new();

        public BuildingControlApplicationFunction SUT() => new(this.DynamicsService.Object, Logger.Object);

        public TestableHttpRequestData BuildHttpRequestDataWithUri()
        {
            var functionContext = new Mock<FunctionContext>();

            var memoryStream = new MemoryStream();
            JsonSerializer.Serialize(memoryStream, string.Empty);

            memoryStream.Flush();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new TestableHttpRequestData(functionContext.Object, new Uri("http://dynamics.com"), memoryStream);
        }
        public List<DynamicsBuildingDetails> GetDynamicsBuildingDetailsEmpty()
        {
            return new List<DynamicsBuildingDetails> {

                new DynamicsBuildingDetails
                {
                    bsr_buildingdetailsid = null,
                    bsr_address1_line1 = null,
                    bsr_address1_postalcode ="WC1E 7JW",
                    bsr_name = null,
                    bsr_address1_city = null,
                    bsr_address1_line2 = null

                }
            };
        }
        public List<DynamicsBuildingDetails> GetDynamicsBuildingDetails()
        {

            return new List<DynamicsBuildingDetails> {

                new DynamicsBuildingDetails
                {
                    bsr_buildingdetailsid = "test1",
                    bsr_address1_line1 = null,
                    bsr_address1_postalcode = "SW1A 1AA",
                    bsr_name = null,
                    bsr_address1_city = null,
                    bsr_address1_line2 = null
                },
                new DynamicsBuildingDetails
                {
                   bsr_buildingdetailsid = "test2",
                    bsr_address1_line1 = null,
                    bsr_address1_postalcode = "SW1A 1AA",
                    bsr_name = null,
                    bsr_address1_city = null,
                    bsr_address1_line2 = null

                }
            };
        }
    }
}
