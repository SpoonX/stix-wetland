import { ServiceManager } from 'stix';
import { EntityCtor } from 'wetland';
import { WetlandService } from '../../Library/Service';
import { patchAction } from '../patchAction';

export const findAction = patchAction('find', (Entity: EntityCtor<any>, sm: ServiceManager) => {
  return async function find ({ state: { query: { criteria, options } } }: any) {
    const results = await sm.get(WetlandService).find(Entity, criteria, options);

    return this.okResponse(results || []);
  };
});
