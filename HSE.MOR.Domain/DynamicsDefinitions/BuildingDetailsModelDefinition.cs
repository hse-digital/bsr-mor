using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class BuildingDetailsModelDefinition : DynamicsModelDefinition<BuildingDetails, DynamicsBuildingDetails>
{
    public override string Endpoint => "bsr_buildingdetailses";

    public override DynamicsBuildingDetails BuildDynamicsEntity(BuildingDetails entity)
    {
        return new DynamicsBuildingDetails(entity.Id);
    }

    public override BuildingDetails BuildEntity(DynamicsBuildingDetails dynamicsEntity)
    {
        return new BuildingDetails();
    }
}
