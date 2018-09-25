import { patchAction } from './patchAction';
import { EntityCtor } from 'wetland';
import { WetlandService } from '../Library/Service';
import { ServiceManager } from 'stix';

export const findAction = patchAction('find', (Entity: EntityCtor<any>, sm: ServiceManager) => {
  return async function find ({ state: { query: { criteria, options } } }: any) {
    const results = await sm.get(WetlandService).getRepository(Entity).find(criteria, options);

    return this.okResponse(results);
  };
});
