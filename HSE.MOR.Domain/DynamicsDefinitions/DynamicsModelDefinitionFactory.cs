﻿
using HSE.MOR.Domain.Entities;
using System.Security.Principal;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class DynamicsModelDefinitionFactory
{
    private readonly Dictionary<Type, IDynamicsModelDefinition> definitions = new()
    {
        [typeof(BuildingInformation)] = new BuildingInformationModelDefinition(),
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
