
using AutoMapper;
using Flurl.Http.Testing;
using Flurl.Http;
using HSE.MOR.API.Services;
using HSE.MOR.Domain.DynamicsDefinitions;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Options;
using Moq;
using Flurl;
using HSE.MOR.API.UnitTests.Helpers;
using System.Text.Json;
using HSE.MOR.API.Models.OrdnanceSurvey;

namespace HSE.MOR.API.UnitTests;

public abstract class UnitTestBase
{
    protected HttpTest HttpTest { get; }
    protected DynamicsService DynamicsService { get; }
    protected IOptions<FeatureOptions> FeatureOptions = new OptionsWrapper<FeatureOptions>(new FeatureOptions());

    protected UnitTestBase()
    {
        FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

        var options = new Mock<IOptions<DynamicsOptions>>();
        var mapper = new Mock<IMapper>();
        options.SetupGet(x => x.Value).Returns(DynamicsOptions);

        HttpTest = new HttpTest();
        DynamicsService = new DynamicsService(new DynamicsModelDefinitionFactory(), mapper.Object, options.Object, new OptionsWrapper<SwaOptions>(new SwaOptions()), new DynamicsApi(options.Object));
    }

    protected readonly DynamicsOptions DynamicsOptions = new()
    {
        EnvironmentUrl = "http://dynamics.api",
        TenantId = "1AEA2273-3130-4432-ABB5-9E45BED87E26",
        ClientId = "77C07F1C-2FB1-4C9F-9C99-82C468AF8299",
        ClientSecret = "BA8787F6-C52B-49F8-B1D1-F9E54754EEF7",
        EmailVerificationFlowUrl = "http://flow_url",
        LocalAuthorityTypeId = "db305f3e-1dad-ed11-83ff-0022481b5e4f"
    };

    protected HttpRequestData BuildHttpRequestData<T>(T data, params string[] parameters)
    {
        return BuildHttpRequestDataWithUri(data, new Uri(DynamicsOptions.EnvironmentUrl));
    }

    protected HttpRequestData BuildHttpRequestData<T>(T data, Parameter[] parameters)
    {
        Uri uri = new Uri(DynamicsOptions.EnvironmentUrl).SetQueryParams(parameters.Select(p => new { key = p.Key, value = p.Value })).ToUri();
        return BuildHttpRequestDataWithUri(data, uri);
    }

    protected TestableHttpRequestData BuildHttpRequestDataWithUri<T>(T data, Uri uri)
    {
        var functionContext = new Mock<FunctionContext>();

        var memoryStream = new MemoryStream();
        JsonSerializer.Serialize(memoryStream, data);

        memoryStream.Flush();
        memoryStream.Seek(0, SeekOrigin.Begin);

        return new TestableHttpRequestData(functionContext.Object, uri, memoryStream);
    }

    protected object BuildODataEntityHeader(string id)
    {
        return $"OData-EntityId={DynamicsOptions.EnvironmentUrl}/api/data/v9.2/whatever_entity({id})";
    }

    protected IMapper GetMapper()
    {
        return new MapperConfiguration(config =>
        {
            config.AddProfile<OrdnanceSurveyPostcodeResponseProfile>();

        }).CreateMapper();
    }
}

public class Parameter
{
    public string Key { get; set; }
    public string Value { get; set; }
}
