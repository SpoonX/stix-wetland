import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { IdParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const findOneAction = patchAction('findOne', (Entity: EntityCtor<any>, sm: ServiceManager) => {
  return async function findOne ({ state: { params: { id } } }: IdParamType) {
    const results = await sm.get(WetlandService).getRepository(Entity).findOne(id);

    return this.okResponse(results);
  };
});
