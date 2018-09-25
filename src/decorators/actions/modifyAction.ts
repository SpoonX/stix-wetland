import { EntityCtor } from 'wetland';
import { ServiceManager } from 'stix';
import { WetlandService } from '../../Library/Service';
import { BodyParamType } from './IdParamType';
import { patchAction } from '../patchAction';

export const modifyAction = patchAction('modify', (Entity: EntityCtor<any>, sm: ServiceManager, recursive = 1) => {
  return async function modify ({ state, request: { body } }: BodyParamType) {
    const service              = sm.get(WetlandService);
    const manager              = await service.getManager();
    const pk                   = manager.getMapping(Entity).getPrimaryKey();
    const { [pk]: x, ...data } = state.data || body;
    const populator            = service.getPopulator(manager);
    const base                 = await populator.findDataForUpdate(state.params.id, Entity as any, data);

    if (!base) {
      return this.notFoundResponse();
    }

    // Assign values to fetched base.
    populator.assign(Entity, data, base, recursive);

    // Apply changes.
    await manager.flush();

    return this.okResponse(base);
  };
});
