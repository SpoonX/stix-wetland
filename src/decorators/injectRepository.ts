import { inject, ServiceManager } from 'stix';
import { EntityCtor, EntityInterface, MetaData } from 'wetland';
import { WetlandService } from '../Library';
import { ensureEntityReference } from './associatedEntity';

export const injectRepository = (Entity?: EntityCtor<EntityInterface>) => {
  return inject(null, (sm: ServiceManager, target: Object) => {
    const TargetReference = MetaData.getConstructor(target);

    return sm.get(WetlandService).getRepository(ensureEntityReference(TargetReference, Entity));
  });
};
