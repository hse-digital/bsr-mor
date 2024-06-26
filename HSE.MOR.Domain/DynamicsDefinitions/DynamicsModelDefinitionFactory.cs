﻿
using HSE.MOR.Domain.Entities;
using System.Security.Principal;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class DynamicsModelDefinitionFactory
{
    private readonly Dictionary<Type, IDynamicsModelDefinition> definitions = new()
    {
        [typeof(BuildingInformation)] = new BuildingInformationModelDefinition(),
        [typeof(BuildingDetails)] = new BuildingDetailsModelDefinition(),
        [typeof(BuildingControlApplication)] = new BuildingControlApplicationModelDefinition(),
        [typeof(BuildingApplication)] = new BuildingApplicationModelDefinition(),
        [typeof(Structure)] = new StructureModelDefinition(),
        [typeof(Incident)] = new IncidentModelDefinition(),
        [typeof(Mor)] = new MORModelDefinition(),
        [typeof(Contact)] = new ContactModelDefinition(),
    };

    public DynamicsModelDefinition<TEntity, TDynamicsEntity> GetDefinitionFor<TEntity, TDynamicsEntity>() where TEntity : Entity
        where TDynamicsEntity : DynamicsEntity<TEntity>
    {
        if (definitions.TryGetValue(typeof(TEntity), out var definition))
        {
            return (definition as DynamicsModelDefinition<TEntity, TDynamicsEntity>)!;
        }

        throw new ArgumentException();
    }
}
