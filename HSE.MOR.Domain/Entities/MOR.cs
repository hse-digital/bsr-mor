

using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record MOR(string Id = null) : Entity(Id)
{
    public string ContactId { get; set; }
    public string IncidentId { get; set; }
    public string RequestType { get; set; }
    public string Reason { get; set; }
    public string WhoAreYou { get; set; }
    public string WhoAreYouOther { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string ContactNumber { get; set; }
    public string AskQuestion { get; set; }
    public string AddressRegion { get; set; }
    public string NumberOfFloors { get; set; }
    public string NumberOfUnits { get; set; }
    public string NumberOfFloorsProf { get; set; }
    public string NumberOfUnitsProf { get; set; }
    public string BuildingHeight { get; set; }
    public bool RegistrationFound { get; set; }
    public string HaveComplained { get; set; }
    public string ComplaintAbout { get; set; }
    public string YourSupportInfo { get; set; }
    public NoticeDateModel NoticeDate { get; set; }
    public string WhoWasContacted { get; set; }
    public string WhyContactNotMade { get; set; }
    public string ComplainAboutWho { get; set; }
    public AddressModel Address { get; set; }
    public string CaseNumber { get; set; }
}

public record ReportModel()
{
  public string NoticeReference { get; set; }
  public string OrgRole { get; set; }
  public string WhatToReport { get; set; }
  public string SubmittedNotice { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string IncidentReported { get; set; }
  public string RiskReported { get; set; }
  public string AboutRisk { get; set; }
  public string AboutIncident { get; set; }
  public string CauseOfRisk { get; set; }
  public string CauseOfIncident { get; set; }
  public string WhoAffectedByIncident { get; set; }
  public string WhoAffectedByRisk { get; set; }
  public string RiskKeepPeopleSafe { get; set; }
  public string IncidentKeepPeopleSafe { get; set; }
  public string OrganisationFindOut { get; set; }
  public string OccurrenceDiscovered { get; set; }
  public string SharedWithOthers { get; set; }
  public string OrganisationName { get; set; }
  public string ContactNumber { get; set; }
  public string YourSupportInfo { get; set; }
}

public record NoticeModel()
{
  public string DescribeRiskIncident { get; set; }
  public string WhenBecomeAware { get; set; }
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string ContactNumber { get; set; }
  public string OrganisationName { get; set; }
  public string OrgRole { get; set; }
  public string ActionsToKeepSafe { get; set; }
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
    public string ContactId { get; set; }
    public bool IsManual { get; set; }
    public string Address { get; set; }
}



public record DynamicsMOR() : DynamicsEntity<MOR>
{
    public string incidentid { get; set; }
    public string _bsr_building_value { get; set; }
    public string _customerid_value { get; set; }
    public string _primarycontactid_value { get; set; }
    public string _bsr_buildingregionlookup_value { get; set; }
    public string _bsr_block_incidentid_value { get; set; }
    public BsrCanHelpYou bsr_howcanbsrhelpyou { get; set; }
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
}
