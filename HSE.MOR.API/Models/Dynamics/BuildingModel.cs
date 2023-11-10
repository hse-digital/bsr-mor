namespace HSE.MOR.API.Models.Dynamics;

public record BuildingModel()
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
    public string ContactId { get; set; }
    public bool IsManual { get; set; }
    public string Address { get; set; }
}
