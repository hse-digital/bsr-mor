﻿
namespace HSE.MOR.Domain.Entities;

public record BuildingControlApplication(string buildingApplicationId, string Id = null) : Entity(Id);

public record DynamicsBuildingControlApplication(string bsr_buildingcontrolapplicationid = null, string bsr_bcaareferencenumber = null) : DynamicsEntity<BuildingControlApplication>;
