

using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.Entities;

public record BuildingApplication(string buildingApplicationId, string Id = null) : Entity(Id);

public record DynamicsBuildingApplication(string bsr_buildingapplicationid = null, string bsr_applicationid = null) : DynamicsEntity<BuildingApplication>;


