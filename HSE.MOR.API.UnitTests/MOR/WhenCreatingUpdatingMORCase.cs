using FluentAssertions;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Functions;
using HSE.MOR.API.Models;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using HSE.MOR.API.UnitTests.Helpers;
using HSE.MOR.Domain.Entities;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json;
using Xunit;

namespace HSE.MOR.API.UnitTests.MOR;

public class WhenCreatingUpdatingMORCase
{
    [Fact]
    public async Task WhenCreateMORReturnsEmptyIncident()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.CreateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.DynamicsIncidentEmpty());
        var function = testClass.SUT();
        //Act       
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.NewMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.Should().Be(testClass.DynamicsIncidentEmpty());

    }
    [Fact]
    public async Task WhenCreateMORReturnedWithMORNumber()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.CreateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.NewMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.Should().Be(testClass.GetDynamicsIncidentWithMORNumber());

    }
    [Fact]
    public async Task WhenUpdateMORReturnedWithMORNumber()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.UpdateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.UpdateMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.Should().Be(testClass.GetDynamicsIncidentWithMORNumber());
    }

    [Fact]
    public async Task WhenUpdateMORReturnsEmptyIncident()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.CreateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.DynamicsIncidentEmpty());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.NewMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.Should().Be(testClass.DynamicsIncidentEmpty());
    }

    [Fact]
    public async Task WhenCreateMORIncidentCaseNumberCorrect()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.CreateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.NewMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.CaseNumber.Should().Be("CASE12345");
    }

    [Fact]
    public async Task WhenUpdateMORIncidentCaseNumberCorrect()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.UpdateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.UpdateMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.CaseNumber.Should().Be("CASE12345");
    }

    [Fact]
    public async Task WhenCreateMORReturnedCorrectMORNumber()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.CreateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.NewMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.MorModelDynamics.MORNumber.Should().Be("MOR1234");
    }

    [Fact]
    public async Task WhenUpdateMORReturnedCorrectMORNumber()
    {
        //Arrange
        var testClass = new MORFunctionTestClass();
        testClass.DynamicsService.Setup(x => x.UpdateMORCase_Async(testClass.TestIncidentModel())).ReturnsAsync(testClass.GetDynamicsIncidentWithMORNumber());
        var function = testClass.SUT();
        //Act
        var newRequest = testClass.BuildHttpRequestDataWithUri(testClass.TestIncidentModel());
        var incidentModelEncoded = testClass.Base64Encode(testClass.TestIncidentModel());
        var result = await function.UpdateMORCaseAsync(newRequest, incidentModelEncoded);
        //Assert
        var response = await HttpRequestDataExtensions.ReadAsJsonAsync<Domain.Entities.Incident>(result);
        response.MorModelDynamics.MORNumber.Should().Be("MOR1234");
    }

    public class MORFunctionTestClass
    {
        public Mock<IDynamicsService> DynamicsService { get; } = new();
        public Mock<ILogger<MORFunction>> Logger { get; } = new();

        public MORFunction SUT() => new(this.DynamicsService.Object, Logger.Object);

        public TestableHttpRequestData BuildHttpRequestDataWithUri(IncidentModel data)
        {
            var functionContext = new Mock<FunctionContext>();

            var memoryStream = new MemoryStream();
            JsonSerializer.Serialize(memoryStream, data);

            memoryStream.Flush();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return new TestableHttpRequestData(functionContext.Object, new Uri("http://dynamics.com"), memoryStream);
        }

        public EncodedRequest Base64Encode(Object plainObject)
        {
            var plainText = JsonSerializer.Serialize(plainObject);
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return new EncodedRequest("base64:" + System.Convert.ToBase64String(plainTextBytes));
        }

        public IncidentModel TestIncidentModel()
        {
            return new IncidentModel
            {
                WhatToSubmit = "notice",
                EmailAddress = "test@test.com",
                Notice = new NoticeModel 
                {
                    FirstName = "Test",
                    LastName = "Test",
                    ContactNumber = "+441111111111",
                    ActionsToKeepSafe = "Test",
                    OrganisationName = "Test",
                    OrgRole = "Test",
                    DescribeRiskIncident = "Test",
                    WhenBecomeAware = new TimeModel 
                    { 
                        Year = "2021",
                        Month = "10",
                        Day = "10",
                        Hour = "10",
                        Minute = "10"
                    },
                },
                Building = new BuildingModel 
                {
                    IdentifyBuilding = "test",
                    Address = new Models.Dynamics.AddressModel
                    { 
                        Address = "Test",
                        Postcode = "Test",  
                    }
                }
            };
        }
        public Domain.Entities.Incident DynamicsIncidentEmpty()
        {
            return new Domain.Entities.Incident
            {
                MorModelDynamics = new Mor { 
                    IsNotice = true,
                },              

            };
        }
        public Domain.Entities.Incident GetDynamicsIncidentWithMORNumber()
        {
            return new Domain.Entities.Incident
            {
                CaseNumber = "CASE12345",

                MorModelDynamics = new Mor
                {
                    IsNotice = true,
                    MORNumber = "MOR1234"
                }

            };
        }
        public Domain.Entities.Incident GetDynamicsIncidentWithEmptyNotice()
        {
            return new Domain.Entities.Incident
            {
                CaseNumber = "CASE12346",
                MorModelDynamics = new Mor { }

            };
        }
    }
}
