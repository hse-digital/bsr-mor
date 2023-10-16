

using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record Structure(string Id = null) : Entity(Id);

public record DynamicsStructure(string bsr_blockid = null,
    string bsr_name = null,
string bsr_addressline1 = null,
string bsr_addressline2  = null,
string bsr_city = null,
string bsr_postcode = null) : DynamicsEntity<Structure>;

