using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using HSE.MOR.Domain.Entities;
using Microsoft.DurableTask.Client;
using HSE.MOR.API.Models.FileUpload;

namespace HSE.MOR.API.Functions;

public class MORFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<BuildingApplicationFunction> logger;

    public MORFunction(IDynamicsService dynamicsService, ILogger<BuildingApplicationFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(NewMORCaseAsync))]
    public async Task<CustomHttpResponseData> NewMORCaseAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var customResponse = default(CustomHttpResponseData);       
        try
        {
            var incidentModel = encodedRequest.GetDecodedData<IncidentModel>()!;
            var responseModel = await dynamicsService.CreateMORCase_Async(incidentModel);
            var response = await request.CreateObjectResponseAsync(responseModel);           
            if (response is not null) 
            {              
                if (!responseModel.MorModel.IsNotice && incidentModel.Report?.FilesUploaded.Length > 0) 
                {
                    var sumbissionModel = CreateFileScanModel(incidentModel, responseModel);
                    customResponse = new CustomHttpResponseData
                    {
                        Application = sumbissionModel,
                        HttpResponse = response
                    };                   
                }
                else 
                {
                    customResponse = new CustomHttpResponseData
                    {
                        HttpResponse = response
                    };
                }
            }

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(NewMORCaseAsync), ex);
            throw;
        }
        return customResponse;

    }

    [Function(nameof(UpdateMORCaseAsync))]
    public async Task<CustomHttpResponseData> UpdateMORCaseAsync([HttpTrigger(AuthorizationLevel.Anonymous, "put")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var customResponse = default(CustomHttpResponseData);
        try
        {
            var incidentModel = encodedRequest.GetDecodedData<IncidentModel>()!;
            var responseModel = await dynamicsService.UpdateMORCase_Async(incidentModel);
            var response = await request.CreateObjectResponseAsync(responseModel);
            if (response is not null)
            {
                if (!responseModel.MorModel.IsNotice && incidentModel.Report?.FilesUploaded.Length > 0)
                {
                    var sumbissionModel = CreateFileScanModel(incidentModel, responseModel);
                    customResponse = new CustomHttpResponseData
                    {
                        Application = sumbissionModel,
                        HttpResponse = response
                    };
                }
                else
                {
                    customResponse = new CustomHttpResponseData
                    {
                        HttpResponse = response
                    };
                }
            }

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(UpdateMORCaseAsync), ex);
            throw;
        }
        return customResponse;

    }

    private FileScanModel CreateFileScanModel(IncidentModel incidentModel, Incident incident) 
    {
        var scanModel = new FileScanModel { };
        scanModel.id = incident.Id;
        scanModel.ContactId = incident.CustomerId;
        scanModel.Email = incident.EmailAddress;
        scanModel.FileUploads = incidentModel.Report?.FilesUploaded;
        return scanModel;
    }   
}
