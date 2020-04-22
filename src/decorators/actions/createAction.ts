import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { BodyParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const createAction = patchAction('create', (Entity: EntityCtor<any>, sm: ServiceManager, recursive?: boolean | number) => {
  return async function create ({ request: { body } }: BodyParamType) {
    return this.createdResponse(await sm.get(WetlandService).create(Entity, body, recursive));
  };
});
