using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Incident(string Id = null) : Entity(Id)
{
    public string IncidentId { get; set; }
    public string CustomerId { get; set; }
    public Mor MorModel { get; set; }   
    public Building BuildingModel { get; set; }
    public string EmailAddress { get; set; }
    public string WhatToSubmit { get; set; }    
    public bool RegistrationFound { get; set; }      
    public AddressModel Address { get; set; }
    public string CaseNumber { get; set; }
    public string MorId { get; set; }
}

public record Building()
{
    public string SubmittedDesignBca { get; set; }
    public string IdentifyBuilding { get; set; }
    public string BuildingType { get; set; }
    public AddressModel Address { get; set; }
    public string BuildingName { get; set; }
    public string NumberOfFloors { get; set; }
    public string NumberOfUnits { get; set; }
    public int NumberOfFloorsProf { get; set; }
    public int NumberOfUnitsProf { get; set; }
    public int BuildingHeight { get; set; }
    public string AddressRegion { get; set; }
    public string HasAddress { get; set; }
    public string LocateBuilding { get; set; }
    public string BcaReference { get; set; }
}

public record AddressModel()
{
    public string UPRN { get; set; }
    public string ParentUPRN { get; set; }
    public string USRN { get; set; }
    public string BuildingName { get; set; }
    public string Number { get; set; }
    public string Street { get; set; }
    public string AddressLineTwo { get; set; }
    public string Town { get; set; }
    public string AdministrativeArea { get; set; }
    public string Postcode { get; set; }
    public string BuildingApplicationId { get; set; }
    public string AccountablePerson { get; set; }
    public int NumberOfFloors { get; set; }
    public double BuildingHeight { get; set; }
    public int ResidentialUnits { get; set; }
    public string BuildingId { get; set; }
    public string StructureId { get; set; }
    public string BuildingControlAppId { get; set; }
    public string HrbApplicationId { get; set; }
    public string ContactId { get; set; }
    public bool IsManual { get; set; }
    public string Address { get; set; }
}

public record DynamicsIncident() : DynamicsEntity<Incident>
{
    public string incidentid { get; set; }
    public string _bsr_mor_value { get; set; } 
    public string _bsr_building_value { get; set; }
    public string _customerid_value { get; set; }
    public string _primarycontactid_value { get; set; }
    public string _bsr_buildingregionlookup_value { get; set; }
    public string _bsr_block_incidentid_value { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public BsrCanHelpYou? bsr_howcanbsrhelpyou { get; set; }
    public int? bsr_complaintabout { get; set; }
    public int? bsr_contactrole { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_contactroleother { get; set; }
    public string bsr_contactfirstname { get; set; }
    public string bsr_contactlastname { get; set; }
    public string bsr_contactphone { get; set; }
    public string bsr_contactemail { get; set; }
    public string customerid { get; set; }
    public string primarycontactid { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public int? bsr_complaintabouttopic { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public bool? bsr_sharecontactdetails { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_question { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public int? bsr_howbigisthebuilding { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public int? bsr_2ormoreresidencesinbuilding { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public int? bsr_numberoffloors { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public double? bsr_buildingheight { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public int? bsr_numberofresidentialunits { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildingaddressline1 { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildingaddressline2 { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildingtowncity { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildingcounty { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_buildingpostcode { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public bool? bsr_ismanualaddress { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public bool? bsr_hrdregfound { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public bool? bsr_complainedtoap { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_complaint { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public DateTime? bsr_firstnoticedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_whocontacted { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public DateTime? bsr_firstcontactedon { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_whynotcontactedap { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_whocomplaintabout { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public string bsr_yoursupportinginformation { get; set; }
    public int? casetypecode { get; set; }
    public int? prioritycode { get; set; }
    public int? statecode { get; set; }
    public int? statuscode { get; set; }
    public int? caseorigincode { get; set; }
    public int? incidentstagecode { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_building@odata.bind")]
    public string buildingReferenceId { get; set; }
    [property: JsonPropertyName("customerid_contact@odata.bind")]
    public string customerReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_block_incidentId@odata.bind")]
    public string structureReferenceId { get; set; }
    [property: JsonPropertyName("primarycontactid@odata.bind")]
    public string primaryContactReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_buildingregionlookup@odata.bind")]
    public string regionReferenceId { get; set; }
    public string title { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_MOR@odata.bind")]
    public string morReferenceId { get; set; }
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_relevantBSRfunctionId_bsr_buildingapplication@odata.bind")]
    public string bsrBuildingApplicationFunctionReference { get; set; }     
    [property: JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    [property: JsonPropertyName("bsr_relevantBSRfunctionId_bsr_buildingcontrolapplication@odata.bind")]
    public string bsrBuildingControlApplicationFunctionReference { get; set; }    
    public DynamicsNotice bsr_MOR { get; set; }
}

public enum BsrCanHelpYou
{
    Question = 760810000,
    Complaint = 760810001,
}

public enum ComplaintAbout
{
    Building = 760810000,
    UnoccupiedBuilding = 760810001,
    BuildingInspector = 760810002,
    BuildingSaftyRegulator = 760810003,
}

public enum WhoAreYou
{
    Resident = 760810000,
    MemberOfPublic = 760810001,
    Professional = 760810002,
    Other = 760810003,
    ThirdParty = 760810004,
}

public enum BuildingSize
{
    Floors7And18mHeightMore = 760810000,
    Floors7And18mHeightLess = 760810001,
    DontKnow = 760810002,
}
public enum TwoOrMoreResidentialUnits
{
    Yes = 760810000,
    No = 760810001,
    DontKnow = 760810002,
}

public record NoticeDateModel()
{
    public string year { get; set; }
    public string month { get; set; }
    public string day { get; set; }
};

public record FileUploadModel()
{
    public int Progress { get; set; }
    public string FileName { get; set; }
    public string Status { get; set; }
    public string Message { get; set; }
    public string CaseId { get; set; }
}
