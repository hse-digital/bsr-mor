using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HSE.MOR.API.Models.Dynamics;

public record BuildingModel() : IValidatableModel
{
    public string SubmittedDesignBca { get; set; }
    public string IdentifyBuilding { get; set; }
    public string BuildingType { get; set; }
    public AddressModel Address { get; set; }
    public string BuildingName { get; set; }
    public string NumberOfFloors { get; set; }
    public string NumberOfUnits { get; set; }
    public string NumberOfFloorsProf { get; set; }
    public string NumberOfUnitsProf { get; set; }
    public string BuildingHeight { get; set; }
    public string AddressRegion { get; set; }
    public string HasAddress { get; set; }
    public string LocateBuilding { get; set; }
    public string BcaReference { get; set; }

    public ValidationSummary Validate()
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(IdentifyBuilding))
        {
            errors.Add("IdentifyBuilding is required");
        }
        if (Address is null)
        {
            errors.Add("Address is required");
        }
        if (Address is not null)
        {
            if (string.IsNullOrWhiteSpace(Address.Address))
            {
                errors.Add("Address is required");
            }
            if (string.IsNullOrWhiteSpace(Address.Postcode))
            {
                errors.Add("Postcode is required");
            }
            if (Address.IsManual || !string.IsNullOrWhiteSpace(LocateBuilding))
            {
                if (string.IsNullOrWhiteSpace(Address.NumberOfFloors))
                {
                    errors.Add("NumberOfFloors is required");
                }
                if (string.IsNullOrWhiteSpace(Address.BuildingHeight))
                {
                    errors.Add("NumberOfFloors is required");
                }
                if (string.IsNullOrWhiteSpace(Address.ResidentialUnits))
                {
                    errors.Add("NumberOfFloors is required");
                }               
            }
            if (!string.IsNullOrWhiteSpace(HasAddress))
            {
                if (HasAddress.Equals("no"))
                {
                    if (string.IsNullOrWhiteSpace(LocateBuilding))
                    {
                        errors.Add("LocateBuilding is required");
                    }
                }
            }

        }
        return new ValidationSummary(!errors.Any(), errors.ToArray());
    }
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
    public string NumberOfFloors { get; set; }
    public string BuildingHeight { get; set; }
    public string ResidentialUnits { get; set; }
    public string BuildingId { get; set; }
    public string StructureId { get; set; }
    public string BuildingControlAppId { get; set; }
    public string HrbApplicationId { get; set; }
    public string ContactId { get; set; }
    public bool IsManual { get; set; }
    public string Address { get; set; }
}
