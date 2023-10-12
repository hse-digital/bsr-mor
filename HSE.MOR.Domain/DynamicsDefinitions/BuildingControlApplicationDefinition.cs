using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class BuildingControlApplicationModelDefinition : DynamicsModelDefinition<BuildingControlApplication, DynamicsBuildingControlApplication>
{
    public override string Endpoint => "bsr_buildingcontrolapplications";

    public override DynamicsBuildingControlApplication BuildDynamicsEntity(BuildingControlApplication entity)
    {
        return new DynamicsBuildingControlApplication(entity.Id);
    }

    public override BuildingControlApplication BuildEntity(DynamicsBuildingControlApplication dynamicsEntity)
    {
        return new BuildingControlApplication(dynamicsEntity.bsr_buildingcontrolapplicationid);
    }
}
