import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { IdParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const destroyAction =  patchAction('destroy', (Entity: EntityCtor<any>, sm: ServiceManager) => {
  return async function destroy ({ state: { params: { id } } }: IdParamType) {
    const manager = await sm.get(WetlandService).getManager();
    const result  = await manager.getRepository(Entity).findOne(id);

    if (!result) {
      return this.notFoundResponse();
    }

    await manager.remove(result).flush();

    return this.okResponse(result);
  };
});
