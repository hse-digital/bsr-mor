

using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask.Client;
using HSE.MOR.Domain.Entities;
using HSE.MOR.API.Extensions;
using Microsoft.DurableTask;
using HSE.MOR.API.Models.FileUpload;
using HSE.MOR.API.Models.Dynamics;

namespace HSE.MOR.API.Functions;

public class DynamicsSynchronisationFunctions
{
    private readonly IDynamicsService dynamicsService;

    public DynamicsSynchronisationFunctions(IDynamicsService dynamicsService)
    {
        this.dynamicsService = dynamicsService;
    }


    [Function(nameof(SyncIncident))]
    public async Task<HttpResponseData> SyncIncident([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, [DurableClient] DurableTaskClient durableTaskClient)
    {
        var incidentModel = await request.ReadAsJsonAsync<IncidentModel>();
        await durableTaskClient.ScheduleNewOrchestrationInstanceAsync(nameof(SynchroniseIncident), incidentModel);

        return request.CreateResponse();
    }

    [Function(nameof(SynchroniseIncident))]
    public async Task SynchroniseIncident([OrchestrationTrigger] TaskOrchestrationContext orchestrationContext)
    {
        var incidentModel = orchestrationContext.GetInput<IncidentModel>();
        await orchestrationContext.CallActivityAsync(nameof(UpdateIncidentActivity), incidentModel);
    }

    [Function(nameof(UpdateIncidentActivity))]
    public async Task UpdateIncidentActivity([ActivityTrigger] IncidentModel incident)
    {
        await this.dynamicsService.UpdateMORCase_Async(incident);
    }
}
