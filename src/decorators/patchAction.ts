import { ensureEntityReference } from './associatedEntity';
import { EntityCtor, EntityInterface, MetaData } from 'wetland';
import { patch, ServiceManager } from 'stix';

export const patchAction = (method: string, callback: Function) => {
  // Return decorator factory function
  return (Entity: EntityCtor<EntityInterface>, ...rest: any[]) => {

    // Return decorator function
    return (target: Object) => {

      // Make sure we have the correct controller reference.
      const ControllerReference = MetaData.getConstructor(target);

      // Make sure we have an entity, and that the controller has an associated entity.
      const EntityReference = ensureEntityReference(ControllerReference, Entity);

      // Create a patch decorator function
      const patchMethod = patch(method, (sm: ServiceManager) => callback(EntityReference, sm, ...rest), true);

      // Execute patch decorator
      patchMethod(ControllerReference);
    };
  };
};
