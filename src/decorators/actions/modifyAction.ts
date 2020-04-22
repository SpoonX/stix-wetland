import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { BodyParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const modifyAction = patchAction('modify', (Entity: EntityCtor<any>, sm: ServiceManager, recursive = 1) => {
  return async function modify ({ state, request: { body } }: BodyParamType) {
    const result = await sm.get(WetlandService).modify(Entity, state.params.id, state.data || body, recursive);

    if (!result) {
      return this.notFoundResponse();
    }

    return this.okResponse(result);
  };
});
