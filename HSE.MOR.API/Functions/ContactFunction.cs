using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.API.Services;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace HSE.MOR.API.Functions;

public class ContactFunction
{
    private readonly IDynamicsService dynamicsService;
    private readonly ILogger<ContactFunction> logger;

    public ContactFunction(IDynamicsService dynamicsService, ILogger<ContactFunction> logger)
    {
        this.dynamicsService = dynamicsService;
        this.logger = logger;
    }

    [Function(nameof(CreateContactIfExistsAsync))]
    public async Task<HttpResponseData> CreateContactIfExistsAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData request, EncodedRequest encodedRequest)
    {
        var response = default(HttpResponseData);
        try
        {
            var contactModel = encodedRequest.GetDecodedData<ContactModel>()!;
            
            var responseModel = await this.dynamicsService.CreateContactAsync(contactModel.FirstName, contactModel.LastName,
                contactModel.ContactNumber, contactModel.EmailAddress); 
            response = await request.CreateObjectResponseAsync(responseModel);        
        }
        catch (Exception ex)
        {
            logger.LogError("{methodName} returned EXCEPTION : {ex}", nameof(CreateContactIfExistsAsync), ex);
            throw;
        }
        return response;

    }
}
