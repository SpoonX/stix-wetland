import { EntityCtor, EntityInterface } from 'wetland';
import { createAction, destroyAction, findAction, findOneAction } from './actions';
import { modifyAction } from './actions/modifyAction';

export const dbActions = (Entity?: EntityCtor<EntityInterface>) => {
  const actions = [
    findOneAction(Entity),
    findAction(Entity),
    modifyAction(Entity),
    destroyAction(Entity),
    createAction(Entity),
  ];

  return (target: Object) => actions.forEach(action => action(target));
};
