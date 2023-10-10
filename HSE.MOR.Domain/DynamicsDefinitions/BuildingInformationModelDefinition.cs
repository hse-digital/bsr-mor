using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class BuildingInformationModelDefinition : DynamicsModelDefinition<BuildingInformation, DynamicsBuildingInformation>
{
    public override string Endpoint => "bsr_blocks";

    public override DynamicsBuildingInformation BuildDynamicsEntity(BuildingInformation entity)
    {
        return new DynamicsBuildingInformation(entity.Id);
    }

    public override BuildingInformation BuildEntity(DynamicsBuildingInformation dynamicsEntity)
    {
        return new BuildingInformation();
    }
}
