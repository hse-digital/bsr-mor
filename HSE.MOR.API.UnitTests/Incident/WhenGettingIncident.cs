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

namespace HSE.MOR.API.UnitTests.Incident;

public class WhenGettingIncident
{
    [Fact]
    public async Task WhenIncidentsReturnedNull()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("null")).ReturnsAsync(value: null);
        var function = testClass.SUT();
        //Act       
        var incidentRequestModel = new CaseNumberValidationModel("Empty");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.Should().Be(new DynamicsIncident());

    }
    [Fact]
    public async Task WhenIncidentIsReturnedEmptyNotice()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("Empty")).ReturnsAsync(new DynamicsIncident());
        var function = testClass.SUT();
        //Act
        var incidentRequestModel = new CaseNumberValidationModel("Empty");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.bsr_MOR.Should().Be(null);

    }
    [Fact]
    public async Task WhenIncidentIsReturnsNoticeNull()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("CASE12344")).ReturnsAsync(testClass.GetDynamicsIncidentEmpty());
        var function = testClass.SUT();
        //Act
        var incidentRequestModel = new CaseNumberValidationModel("CASE12344");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.bsr_MOR.Should().Be(null);
    }

    [Fact]
    public async Task WhenIncidentReturnsEmptyNotice()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("CASE12346")).ReturnsAsync(testClass.GetDynamicsIncidentWithEmptyNotice());
        var function = testClass.SUT();
        //Act
        var incidentRequestModel = new CaseNumberValidationModel("CASE12346");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.bsr_MOR.Should().Be(new DynamicsNotice());
    }

    [Fact]
    public async Task WhenIncidentIsCorrect()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("CASE12345")).ReturnsAsync(testClass.GetDynamicsIncidentWithNotice());
        var function = testClass.SUT();
        //Act
        var incidentRequestModel = new CaseNumberValidationModel("CASE12345");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.title.Should().Be("CASE12345");
    }

    [Fact]
    public async Task WhenIncidentIsWithCorrectNotice()
    {
        //Arrange
        var testClass = new IncidentFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.GetIncidentUsingCaseNumber_Async("CASE12345")).ReturnsAsync(testClass.GetDynamicsIncidentWithNotice());
        var function = testClass.SUT();
        //Act
        var incidentRequestModel = new CaseNumberValidationModel("CASE12345");
        var newRequest = testClass.BuildHttpRequestDataWithUri(incidentRequestModel);
        var result = await function.GetIncidentUsingCaseNumberAsync(newRequest);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<DynamicsIncident>(result);
        response.bsr_MOR.title.Should().Be("MOR1234");
    }

    public class IncidentFunctionTestClass
    {
        public Mock<IDynamicsService> DynamicsService { get; } = new();
        public Mock<ILogger<IncidentFunction>> Logger { get; } = new();

        public IncidentFunction SUT() => new(this.DynamicsService.Object, Logger.Object);

        public TestableHttpRequestData BuildHttpRequestDataWithUri(CaseNumberValidationModel data)
        {
            var functionContext = new Mock<FunctionContext>();

            var memoryStream = new MemoryStream();
            JsonSerializer.Serialize(memoryStream, data);

            memoryStream.Flush();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new TestableHttpRequestData(functionContext.Object, new Uri("http://dynamics.com"), memoryStream);
        }
        public DynamicsIncident GetDynamicsIncidentEmpty()
        {
            return new DynamicsIncident
            {
                title = "CASE12344",
                
                bsr_MOR = null

            };
        }
        public DynamicsIncident GetDynamicsIncidentWithNotice()
        {
            return new DynamicsIncident
            {
                title = "CASE12345",

                bsr_MOR = new DynamicsNotice { 
                    title = "MOR1234"
                }

            };
        }
        public DynamicsIncident GetDynamicsIncidentWithEmptyNotice()
        {
            return new DynamicsIncident
            {
                title = "CASE12346",
                bsr_MOR = new DynamicsNotice { }

            };
        }
    }
}
