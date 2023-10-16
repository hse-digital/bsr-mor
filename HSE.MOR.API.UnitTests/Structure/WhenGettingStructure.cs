
using FluentAssertions;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Functions;
using HSE.MOR.API.Services;
using HSE.MOR.API.UnitTests.Helpers;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json;
using Xunit;

namespace HSE.MOR.API.UnitTests.Structure;

public class WhenGettingStructure
{
    [Fact]
    public async Task WhenStructureIsReturnedNull()
    {
        //Arrange
        var testClass = new BuildingApplicationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsStructureUsingHrbrNumber_Async("null")).ReturnsAsync(value: null);
        var function = testClass.SUT();
        //Act       
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsStructureByHrbrNumberAsync(newRequest, "null");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsStructure>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenStructureIsReturnedEmptyList()
    {
        //Arrange
        var testClass = new BuildingApplicationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsStructureUsingHrbrNumber_Async("Empty")).ReturnsAsync(new List<DynamicsStructure>());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsStructureByHrbrNumberAsync(newRequest, "Empty");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsStructure>>(result);
        response.Count.Should().Be(0);

    }
    [Fact]
    public async Task WhenStructureIsReturned()
    {
        //Arrange
        var testClass = new BuildingApplicationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsStructureUsingHrbrNumber_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetails());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsStructureByHrbrNumberAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsStructure>>(result);
        response.Count.Should().Be(2);
    }

    [Fact]
    public async Task WhenStructureIsCorrect()
    {
        //Arrange
        var testClass = new BuildingApplicationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsStructureUsingHrbrNumber_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetails());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsStructureByHrbrNumberAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsStructure>>(result);
        response.FirstOrDefault().bsr_postcode.Should().Be("SW1A 1AA");
    }

    [Fact]
    public async Task WhenStructureIsIncorrect()
    {
        //Arrange
        var testClass = new BuildingApplicationFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetDynamicsStructureUsingHrbrNumber_Async("TEST1")).ReturnsAsync(testClass.GetDynamicsBuildingDetailsEmpty());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri();
        var result = await function.GetDynamicsStructureByHrbrNumberAsync(newRequest, "TEST1");
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<List<DynamicsStructure>>(result);
        response.FirstOrDefault().bsr_postcode.Should().NotBe("SW1A 1AA");
    }

    public class BuildingApplicationFunctionTestClass
    {
        public Mock<IDynamicsService> DynamicsService { get; } = new();
        public Mock<ILogger<BuildingApplicationFunction>> Logger { get; } = new();

        public BuildingApplicationFunction SUT() => new(this.DynamicsService.Object, Logger.Object);

        public TestableHttpRequestData BuildHttpRequestDataWithUri()
        {
            var functionContext = new Mock<FunctionContext>();

            var memoryStream = new MemoryStream();
            JsonSerializer.Serialize(memoryStream, string.Empty);

            memoryStream.Flush();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new TestableHttpRequestData(functionContext.Object, new Uri("http://dynamics.com"), memoryStream);
        }
        public List<DynamicsStructure> GetDynamicsBuildingDetailsEmpty()
        {
            return new List<DynamicsStructure> {

                new DynamicsStructure
                {
                    bsr_addressline1 = null,
                    bsr_addressline2 = null,
                    bsr_blockid = null,
                    bsr_city = null,
                    bsr_name = null,
                    bsr_postcode = "WC1E 7JW"
                }
            };
        }
        public List<DynamicsStructure> GetDynamicsBuildingDetails()
        {

            return new List<DynamicsStructure> {

                new DynamicsStructure
                {
                    bsr_addressline1 = null,
                    bsr_addressline2 = null,
                    bsr_blockid = null,
                    bsr_city = null,
                    bsr_name = "Test1",
                    bsr_postcode = "SW1A 1AA"
                },
                new DynamicsStructure
                {
                   bsr_addressline1 = null,
                    bsr_addressline2 = null,
                    bsr_blockid = null,
                    bsr_city = null,
                    bsr_name = "Test2",
                    bsr_postcode = "SW1A 1AA"
                }
            };
        }
    }
}
