using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record BuildingInformation(string Id = null) : Entity(Id);

public record DynamicsBuildingInformation(string bsr_blockid = null,
    string bsr_uprn = null,
    string bsr_usrn = null,
    string bsr_name = null,
    string bsr_addressline1 = null,
    string bsr_city = null,
    string bsr_postcode = null
    ) : DynamicsEntity<BuildingInformation>;
