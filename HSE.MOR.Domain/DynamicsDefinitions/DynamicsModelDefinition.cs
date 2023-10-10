using HSE.MOR.Domain.Entities;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public abstract class DynamicsModelDefinition<TEntity, TDynamicsEntity> : IDynamicsModelDefinition where TEntity : Entity
    where TDynamicsEntity : DynamicsEntity<TEntity>
{
    public abstract string Endpoint { get; }

    public abstract TDynamicsEntity BuildDynamicsEntity(TEntity entity);

    public abstract TEntity BuildEntity(TDynamicsEntity dynamicsEntity);
}

public interface IDynamicsModelDefinition
{
}
