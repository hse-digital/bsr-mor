using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using HSE.MOR.Domain.Entities;
using Microsoft.DurableTask.Client;
using HSE.MOR.API.Models.FileUpload;
using Azure;

namespace HSE.MOR.API.Functions;

public class MORFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<MORFunction> logger;

    public MORFunction(IDynamicsService dynamicsService, ILogger<MORFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(NewMORCaseAsync))]
    public async Task<HttpResponseData> NewMORCaseAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var response = default(HttpResponseData);       
        try
        {
            var incidentModel = encodedRequest.GetDecodedData<IncidentModel>()!;
            var incidentValidation = incidentModel.Validate();
            if (!incidentValidation.IsValid)
            {
                return await request.BuildValidationErrorResponseDataAsync(incidentValidation);
            }
            var responseModel = await dynamicsService.CreateMORCase_Async(incidentModel);
            response = await request.CreateObjectResponseAsync(responseModel);           
            //if (response is not null) 
            //{              
            //    if (!responseModel.MorModelDynamics.IsNotice && incidentModel.Report?.FilesUploaded.Length > 0) 
            //    {
            //        var sumbissionModel = CreateFileScanModel(incidentModel, responseModel);
            //        customResponse = new CustomHttpResponseData
            //        {
            //            Application = sumbissionModel,
            //            HttpResponse = response
            //        };                   
            //    }
            //    else 
            //    {
            //        customResponse = new CustomHttpResponseData
            //        {
            //            HttpResponse = response
            //        };
            //    }
            //}

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(NewMORCaseAsync), ex);
            throw;
        }
        return response;

    }

    [Function(nameof(UpdateMORCaseAsync))]
    public async Task<HttpResponseData> UpdateMORCaseAsync([HttpTrigger(AuthorizationLevel.Anonymous, "put")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var response = default(HttpResponseData);
        try
        {
            var incidentModel = encodedRequest.GetDecodedData<IncidentModel>()!;
            var incidentValidation = incidentModel.Validate();
            if (!incidentValidation.IsValid) 
            {
                return await request.BuildValidationErrorResponseDataAsync(incidentValidation);
            }
            var responseModel = await dynamicsService.UpdateMORCase_Async(incidentModel);
            response = await request.CreateObjectResponseAsync(responseModel);
            //if (response is not null)
            //{
            //    if (!responseModel.MorModelDynamics.IsNotice && incidentModel.Report?.FilesUploaded.Length > 0)
            //    {
            //        var sumbissionModel = CreateFileScanModel(incidentModel, responseModel);
            //        customResponse = new CustomHttpResponseData
            //        {
            //            Application = sumbissionModel,
            //            HttpResponse = response
            //        };
            //    }
            //    else
            //    {
            //        customResponse = new CustomHttpResponseData
            //        {
            //            HttpResponse = response
            //        };
            //    }
            //}

        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(UpdateMORCaseAsync), ex);
            throw;
        }
        return response;

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
