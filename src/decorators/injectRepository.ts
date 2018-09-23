import { inject, ServiceManager } from 'stix';
import { EntityCtor, EntityInterface } from 'wetland';
import { WetlandService } from '../Library';

export const injectRepository = (Entity: EntityCtor<EntityInterface>) => {
  return inject(null, (sm: ServiceManager) => {
    return sm.get(WetlandService).getRepository(Entity);
  });
};
