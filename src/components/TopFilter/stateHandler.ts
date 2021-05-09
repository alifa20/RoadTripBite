import {initialState} from './initialState';
import {Filter, SetFilterPayload, State} from './types';

export const setIsDirty = (
  state: State,
  {isDirty, isSearching}: {isDirty: boolean; isSearching: boolean},
) => ({
  ...state,
  isDirty,
  isSearching,
});

export const setIsSearching = (
  state: State,
  {isSearching}: {isSearching: boolean},
) => ({
  ...state,
  isSearching,
});

export const clearFilter = (state: State) => initialState;

export const updateFilter = (
  state: State,
  {
    isDirty,
    filter: {key, ...rest},
  }: {isDirty: boolean; filter: SetFilterPayload},
) => ({
  ...state,
  filter: {...state.filter, [key]: rest},
  isDirty,
});

export const updateOldFilter = (
  state: State,
  {
    isDirty,
    filter: {key, ...rest},
  }: {isDirty: boolean; filter: SetFilterPayload},
) => ({
  ...state,
  filter: {...state.filter, [key]: rest},
  isDirty,
});
