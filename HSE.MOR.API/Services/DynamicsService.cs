using AutoMapper;
using DurableTask.Core;
using Flurl.Http;
using Flurl.Util;
using HSE.MOR.API.Extensions;
using HSE.MOR.API.Models;
using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.Domain.DynamicsDefinitions;
using HSE.MOR.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HSE.MOR.API.Services;

public interface IDynamicsService {
    Task SendVerificationEmail(string emailAddress, string otpToken);
    Task<List<DynamicsBuildingInformation>> GetBuildingInformationUsingPostcode_Async(string postcode);
    Task<List<DynamicsBuildingDetails>> GetBuildingDetailsUsingPostcode_Async(string postcode);
    Task<DynamicsBuildingControlApplication> GetBuildingControlApplicationId_Async(string bcaReferenceNumber);
    Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingId_Async(string applicationId);
    Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingBcaReference_Async(string bcaReference);
    Task<List<DynamicsStructure>> GetDynamicsStructureUsingHrbrNumber_Async(string hrbrNumber);
    Task<DynamicsBuildingApplication> GetBuildingApplicationId_Async(string hrbrNumber);
    Task<List<DynamicsStructure>> GetStructureUsingId_Async(string buildingApplicationId);
    Task<DynamicsIncident> GetIncidentUsingCaseNumber_Async(string caseNumber);
    Task<Incident> CreateMORCase_Async(IncidentModel model);
}

public class DynamicsService : IDynamicsService
{
    private readonly IMapper mapper;
    private readonly DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory;
    private readonly DynamicsOptions dynamicsOptions;
    private readonly SwaOptions swaOptions;
    private readonly DynamicsApi dynamicsApi;

    public DynamicsService(DynamicsModelDefinitionFactory dynamicsModelDefinitionFactory, IMapper mapper,
        IOptions<DynamicsOptions> dynamicsOptions, IOptions<SwaOptions> swaOptions, DynamicsApi dynamicsApi) 
    {
        this.dynamicsModelDefinitionFactory = dynamicsModelDefinitionFactory;
        this.mapper = mapper;
        this.dynamicsOptions = dynamicsOptions.Value;
        this.swaOptions = swaOptions.Value;
        this.dynamicsApi = dynamicsApi;
    }
    public async Task SendVerificationEmail(string emailAddress, string otpToken)
    {
        await dynamicsOptions.EmailVerificationFlowUrl.PostJsonAsync(new { emailAddress = emailAddress.ToLower(), otp = otpToken,  hrbRegUrl = swaOptions.Url });
    }

    public async Task<List<DynamicsBuildingInformation>> GetBuildingInformationUsingPostcode_Async(string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingInformation>>("bsr_blocks", new[]
        {
            ("$filter", $"bsr_postcode eq '{postcode}'")
        });

        return response.value.ToList();
    }

    public async Task<List<DynamicsBuildingDetails>> GetBuildingDetailsUsingPostcode_Async(string postcode)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingDetails>>("bsr_buildingdetailses", new[]
        {
            ("$filter", $"bsr_address1_postalcode eq '{postcode}'")
        });

        return response.value.ToList();
    }

    public async Task<List<DynamicsStructure>> GetStructureUsingId_Async(string buildingApplicationId)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsStructure>>("bsr_blocks", new[]
        {
            ("$filter", $"_bsr_buildingapplicationid_value eq '{buildingApplicationId}'")
        });

        return response.value.ToList();
    }

    public async Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingId_Async(string applicationId) 
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingDetails>>("bsr_buildingdetailses", new[] 
        {
            ("$filter", $"_bsr_bcapplicationid_value eq '{applicationId}' ")
        });

        return response.value.ToList();
    }

    public async Task<DynamicsBuildingControlApplication> GetBuildingControlApplicationId_Async(string bcaReferenceNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingControlApplication>>("bsr_buildingcontrolapplications",
            new[] { ("$filter", $"bsr_bcaareferencenumber eq '{bcaReferenceNumber}'"), ("$select", "bsr_buildingcontrolapplicationid") });

        return response.value.FirstOrDefault();
    }

    public async Task<DynamicsBuildingApplication> GetBuildingApplicationId_Async(string hrbrNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsBuildingApplication>>("bsr_buildingapplications",
            new[] { ("$filter", $"bsr_applicationid eq '{hrbrNumber}'"), ("$select", "bsr_buildingapplicationid") });

        return response.value.FirstOrDefault();
    }

    public async Task<List<DynamicsBuildingDetails>> GetDynamicsBuildingDetailsUsingBcaReference_Async(string bcaReference) 
    {
        var buildingDetailsList = new List<DynamicsBuildingDetails>();
        var buildingControlApp = await GetBuildingControlApplicationId_Async(bcaReference);
        if (buildingControlApp is not null) 
        {
            if (!string.IsNullOrWhiteSpace(buildingControlApp.bsr_buildingcontrolapplicationid)) 
            {
                buildingDetailsList = await GetDynamicsBuildingDetailsUsingId_Async(buildingControlApp.bsr_buildingcontrolapplicationid);
            }          
        }
        return buildingDetailsList;
    }

    public async Task<List<DynamicsStructure>> GetDynamicsStructureUsingHrbrNumber_Async(string hrbrNumber)
    {
        var structuresList = new List<DynamicsStructure>();
        var buildingApp = await GetBuildingApplicationId_Async(hrbrNumber);
        if (buildingApp is not null)
        {
            if (!string.IsNullOrWhiteSpace(buildingApp.bsr_buildingapplicationid))
            {
                structuresList = await GetStructureUsingId_Async(buildingApp.bsr_buildingapplicationid);
            }
        }
        return structuresList;
    }

    public async Task<DynamicsIncident> GetIncidentUsingCaseNumber_Async(string caseNumber)
    {
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsIncident>>("incidents", new[]
       {
            ("$filter", $"title eq '{caseNumber}'"),
            ("$expand", "bsr_MOR")
        });

        return response.value.FirstOrDefault();
    }

    public async Task<Incident> CreateMORCase_Async(IncidentModel model)
    {                      
        var caseModel = mapper.Map<Incident>(model);
        Contact contact = null;
        if (caseModel.MorModel.IsNotice)
        {
            contact = await CreateContactAsync(caseModel.MorModel.NoticeFirstName, caseModel.MorModel.NoticeLastName, 
                caseModel.MorModel.NoticeContactNumber, caseModel.EmailAddress);
            caseModel.MorModel.CustomerNoticeReferenceId = contact.Id;
        }
        else 
        {
            contact = await CreateContactAsync(caseModel.MorModel.ReportFirstName, caseModel.MorModel.ReportLastName,
                caseModel.MorModel.ReportContactNumber, caseModel.EmailAddress);
            caseModel.MorModel.CustomerReportReferenceId = contact.Id;
        }
        
        var mor = await CreateMORAsync(caseModel.MorModel);

        caseModel.CustomerId = contact.Id;
        caseModel.MorId = mor.Id;
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Incident, DynamicsIncident>();
        var dynamicsCase = modelDefinition.BuildDynamicsEntity(caseModel);

        var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsCase, true);
        var incident = await response.GetJsonAsync<DynamicsIncident>();
        await UpdateMORWithCaseIdAsync(incident.incidentid, mor);
        return caseModel with { Id = incident.incidentid, CaseNumber = incident.title };
    }

    private async Task<Contact> CreateContactAsync(string firstName, string lastName, string contactNumber, string email)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Contact, DynamicsContact>();
        var contact = new Contact(firstName, lastName, contactNumber, email);
        var dynamicsContact = modelDefinition.BuildDynamicsEntity(contact);

        var existingContact = await FindExistingContactAsync(contact.FirstName, contact.LastName, contact.Email, contact.PhoneNumber);
        if (existingContact == null)
        {
            var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsContact);
            var contactId = ExtractEntityIdFromHeader(response.Headers);
            await AssignContactTypeAsync(contactId, DynamicsContactTypes.HRBRegistrationApplicant);

            return contact with { Id = contactId };
        }
        return contact with { Id = existingContact.contactid };
    }

    private async Task UpdateMORWithCaseIdAsync(string incidentId, Mor mor) 
    {
        mor.IncidentReference = incidentId;
        var noticeModelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Mor, DynamicsMor>();
        var dynamicsNotice = noticeModelDefinition.BuildDynamicsEntity(mor);
        await UpdateMORAsync(mor.Id, dynamicsNotice);
    }

    private async Task<Mor> CreateMORAsync(Mor mor)
    {
        var modelDefinition = dynamicsModelDefinitionFactory.GetDefinitionFor<Mor, DynamicsMor>();
        var dynamicsMOR = modelDefinition.BuildDynamicsEntity(mor);

        var response = await dynamicsApi.Create(modelDefinition.Endpoint, dynamicsMOR);
        var morId = ExtractEntityIdFromHeader(response.Headers);

        return mor with { Id = morId };
    }

    private async Task<DynamicsContact> FindExistingContactAsync(string firstName, string lastName, string email, string phoneNumber)
    {
        var contactNumber = !string.IsNullOrWhiteSpace(phoneNumber) ? phoneNumber : string.Empty;
        var emailAddres = !string.IsNullOrWhiteSpace(email) ? email : string.Empty;
        var response = await dynamicsApi.Get<DynamicsResponse<DynamicsContact>>("contacts", new[]
        {
            ("$filter", $"firstname eq '{firstName.EscapeSingleQuote()}' and lastname eq '{lastName.EscapeSingleQuote()}' and emailaddress1 eq '{emailAddres.EscapeSingleQuote()}' and contains(telephone1, '{contactNumber.Replace("+", string.Empty).EscapeSingleQuote()}')"),
            ("$expand", "bsr_contacttype_contact")
        });

        return response.value.FirstOrDefault();
    }

    public async Task<IFlurlResponse> UpdateCaseAsync(string id, DynamicsIncident dynamicsIncident)
    {
        return await dynamicsApi.Update($"incidents({id})", dynamicsIncident);
    }

    public async Task<IFlurlResponse> UpdateMORAsync(string id, DynamicsMor dynamicsMor)
    {
        return await dynamicsApi.Update($"bsr_mors({id})", dynamicsMor);
    }

    public async Task<IFlurlResponse> UpdateContactAsync(string id, DynamicsContact dynamicsContact)
    {
        return await dynamicsApi.Update($"contacts({id})", dynamicsContact);
    }

    private async Task AssignContactTypeAsync(string contactId, string contactTypeId)
    {
        await dynamicsApi.Create($"contacts({contactId})/bsr_contacttype_contact/$ref", new DynamicsContactType
        {
            contactTypeReferenceId = $"{dynamicsOptions.EnvironmentUrl}/api/data/v9.2/bsr_contacttypes({contactTypeId})"
        });
    }

    public async Task<string> GetAuthenticationTokenAsync()
    {
        var response = await $"https://login.microsoftonline.com/{dynamicsOptions.TenantId}/oauth2/token"
            .PostUrlEncodedAsync(new
            {
                grant_type = "client_credentials",
                client_id = dynamicsOptions.ClientId,
                client_secret = dynamicsOptions.ClientSecret,
                resource = dynamicsOptions.EnvironmentUrl
            })
            .ReceiveJson<DynamicsAuthenticationModel>();

        return response.AccessToken;
    }

    private string ExtractEntityIdFromHeader(IReadOnlyNameValueList<string> headers)
    {
        var header = headers.FirstOrDefault(x => x.Name == "OData-EntityId");
        var id = Regex.Match(header.Value, @"\((.+)\)");

        return id.Groups[1].Value;
    }
}
