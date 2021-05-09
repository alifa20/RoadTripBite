import {initialState} from './initialState';
import {
  clearFilter,
  setIsDirty,
  updateFilter,
  setIsSearching,
} from './stateHandler';
import {Action} from './types';

export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'SET_IS_SEARCHING':
      return setIsSearching(state, action.payload);

    case 'SET_IS_DIRTY':
      return setIsDirty(state, action.payload);

    case 'CLEAR_FILTER':
      return clearFilter(state);

    case 'UPDATE_FILTER':
      return updateFilter(state, action.payload);

    default:
      return state;
  }
};
