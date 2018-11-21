import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { IdParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const destroyAction =  patchAction('destroy', (Entity: EntityCtor<any>, sm: ServiceManager) => {
  return async function destroy ({ state: { params: { id } } }: IdParamType) {
    const result = await sm.get(WetlandService).destroy(Entity, id);

    if (!result) {
      return this.notFoundResponse();
    }

    return this.okResponse(result);
  };
});
