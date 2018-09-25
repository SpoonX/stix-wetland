import { EntityCtor, EntityInterface, MetaData } from 'wetland';
import { associatedEntityMetaKey } from './metaKeys';

export const associatedEntity = (Entity: EntityCtor<EntityInterface>) => {
  return (target: Object) => associateEntity(Entity, target);
};

export const associateEntity = (Entity: EntityCtor<EntityInterface>, target: Object) => {
  Reflect.defineMetadata(associatedEntityMetaKey, Entity, target);
};

export const getAssociatedEntity = (target: Object) => Reflect.getMetadata(associatedEntityMetaKey, target);

export const ensureEntityReference = (controller: Object, Entity: EntityCtor<EntityInterface>): EntityCtor<EntityInterface> => {
  if (Entity) {
    associateEntity(Entity, controller);
  }

  return Entity || getAssociatedEntity(controller);
};
