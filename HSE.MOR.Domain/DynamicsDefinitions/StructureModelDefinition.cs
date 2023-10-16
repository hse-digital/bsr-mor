
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class StructureModelDefinition : DynamicsModelDefinition<Structure, DynamicsStructure>
{
    public override string Endpoint => "bsr_blocks";

    public override DynamicsStructure BuildDynamicsEntity(Structure entity)
    {
        return new DynamicsStructure(entity.Id);
    }

    public override Structure BuildEntity(DynamicsStructure dynamicsEntity)
    {
        return new Structure();
    }
}
