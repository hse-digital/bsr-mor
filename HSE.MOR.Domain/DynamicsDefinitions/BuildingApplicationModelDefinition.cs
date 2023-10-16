

using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class BuildingApplicationModelDefinition : DynamicsModelDefinition<BuildingApplication, DynamicsBuildingApplication>
{
    public override string Endpoint => "bsr_buildingapplications";

    public override DynamicsBuildingApplication BuildDynamicsEntity(BuildingApplication entity)
    {
        return new DynamicsBuildingApplication(entity.Id);
    }

    public override BuildingApplication BuildEntity(DynamicsBuildingApplication dynamicsEntity)
    {
        return new BuildingApplication(dynamicsEntity.bsr_buildingapplicationid);
    }
}
