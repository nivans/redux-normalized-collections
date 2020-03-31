import {
  Namespaced,
  InvalidActionCreator,
  AttachActionCreator,
  AttachAction,
  DetachActionCreator,
  DetachAction,
  DeleteAction,
  DeleteActionCreator,
  AnyAction,
  ActionTypes,
} from './interfaces';

import { ModelSchemaReader } from './schema';

import * as messages from './messages';

export const makeActions = (schema: ModelSchemaReader, namespaced: Namespaced) => {
  const BATCH = namespaced('BATCH');
  const INVALID = namespaced('INVALID');
  const ATTACH = namespaced('ATTACH');
  const DETACH = namespaced('DETACH');
  const DELETE = namespaced('DELETE');

  const invalid: InvalidActionCreator = (action, error) => ({
    type: INVALID,
    error,
    action,
  });

  const attach: AttachActionCreator = (entityType, id, relation, relatedId, options = {}) => {
    const action: AttachAction = {
      type: ATTACH,
      entityType,
      id,
      relation,
      attachableId: relatedId,
      index: options.index,
      reciprocalIndex: options.reciprocalIndex,
    };

    if (!schema.typeExists(entityType)) {
      return invalid(action, messages.entityTypeDne(entityType));
    }

    if (!schema.type(entityType).resolveRelationKey(relation)) {
      return invalid(action, messages.relDne(entityType, relation));
    }

    return action;
  };

  const detach: DetachActionCreator = (entityType, id, relation, relatedId) => {
    const action: DetachAction = {
      type: DETACH,
      entityType,
      id,
      relation,
      detachableId: relatedId,
    };

    if (!schema.typeExists(entityType)) {
      return invalid(action, messages.entityTypeDne(entityType));
    }

    if (!schema.type(entityType).resolveRelationKey(relation)) {
      return invalid(action, messages.relDne(entityType, relation));
    }

    return action;
  };

  const del: DeleteActionCreator = (entityType, id) => {
    const action: DeleteAction = {
      type: DELETE,
      entityType,
      id,
    };

    if (!schema.typeExists(entityType)) {
      return invalid(action, messages.entityTypeDne(entityType));
    }

    return action;
  };

  const actionTypes = {
    BATCH,
    INVALID,
    ATTACH,
    DETACH,
    DELETE,
  };

  const actionCreators = {
    attach,
    detach,
    delete: del,
  };

  const actionUtils = new ActionUtils(actionTypes);

  return {
    actionTypes,
    actionCreators,
    actionUtils,
  };
};

export class ActionUtils {
  actionTypes: ActionTypes;

  constructor(actionTypes: ActionTypes) {
    this.actionTypes = actionTypes;
  }

  isHandleable(action: AnyAction) {
    return Object.values(this.actionTypes).includes(action.type);
  }

  isDerivable(action: AnyAction) {
    const { DETACH, DELETE, ATTACH } = this.actionTypes;
    return [DETACH, DELETE, ATTACH].includes(action.type);
  }

  isBatch(action: AnyAction) {
    return action.type === this.actionTypes.BATCH;
  }
}
