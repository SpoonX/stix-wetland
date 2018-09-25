import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { BodyParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const createAction = patchAction('create', (Entity: EntityCtor<any>, sm: ServiceManager, recursive?: boolean | number) => {
  return async function create ({ request: { body } }: BodyParamType) {
    const service          = sm.get(WetlandService);
    const manager          = await service.getManager();
    const populator        = service.getPopulator(manager);
    const persistedEntries = (() => {
      if (!Array.isArray(body)) {
        const newRecord = populator.assign(Entity, body, null, recursive);

        manager.persist(newRecord);

        return newRecord;
      }

      return body.map((entry: Object) => {
        const newRecord = populator.assign(Entity, entry, null, recursive);

        manager.persist(newRecord);

        return newRecord;
      });
    })();

    await manager.flush();

    return this.createdResponse(persistedEntries);
  };
});
