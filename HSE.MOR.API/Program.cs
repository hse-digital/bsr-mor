using Flurl.Http.Configuration;
using Flurl.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json.Serialization;
using System.Text.Json;
using HSE.MOR.API.Services;
using HSE.MOR.Domain.DynamicsDefinitions;
using AutoMapper;
using HSE.MOR.API.Models.OrdnanceSurvey;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.BlobStore;
using HSE.MOR.API.Models.Dynamics;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(workerOptions =>
    {
        workerOptions.InputConverters.Register<EncodedRequestConverter>();
    })
    .ConfigureServices(ConfigureServices)
    .Build();

FlurlHttp.Configure(settings => { settings.JsonSerializer = new SystemTextJsonSerializer(); });

host.Run();


static void ConfigureServices(HostBuilderContext builderContext, IServiceCollection serviceCollection)
{
    serviceCollection.Configure<DynamicsOptions>(builderContext.Configuration.GetSection(DynamicsOptions.Dynamics));
    serviceCollection.Configure<SwaOptions>(builderContext.Configuration.GetSection(SwaOptions.Swa));
    serviceCollection.Configure<IntegrationsOptions>(builderContext.Configuration.GetSection(IntegrationsOptions.Integrations));
    serviceCollection.Configure<BlobStoreOptions>(builderContext.Configuration.GetSection(BlobStoreOptions.BlobStore));
    serviceCollection.AddSingleton<IBlobClient, BlobStoreClient>();
    serviceCollection.AddTransient<IBlobSASUri, BlobSASUri>();
    serviceCollection.AddTransient<OTPService>();
    serviceCollection.AddTransient<IDynamicsService, DynamicsService>();
    serviceCollection.AddTransient<DynamicsModelDefinitionFactory>();
    serviceCollection.AddTransient<DynamicsApi>();
    serviceCollection.AddLogging();

    serviceCollection.AddSingleton(_ => new MapperConfiguration(config =>
    {
        config.AddProfile<OrdnanceSurveyPostcodeResponseProfile>();
        config.AddProfile<MORDynamicsResponseProfile>();

    }).CreateMapper());
}

public class SystemTextJsonSerializer : ISerializer
{
    private readonly JsonSerializerOptions serializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true
    };

    public string Serialize(object obj)
    {
        return JsonSerializer.Serialize(obj, serializerOptions);
    }

    public T Deserialize<T>(string s)
    {
        return JsonSerializer.Deserialize<T>(s, serializerOptions);
    }

    public T Deserialize<T>(Stream stream)
    {
        return JsonSerializer.Deserialize<T>(stream, serializerOptions);
    }
}
