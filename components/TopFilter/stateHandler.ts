import { initialState } from "./initialState";
import { Filter, SetFilterPayload, State } from "./types";

export const setIsDirty = (
  state: State,
  { isDirty }: { isDirty: boolean }
) => ({
  ...state,
  isDirty,
});

export const setFilter = (
  state: State,
  { isDirty, filter }: { isDirty: boolean; filter: Filter }
) => ({
  ...state,
  oldFilter: initialState.oldFilter,
  newFilter: filter,
  isDirty,
});

export const setOldFilter = (state: State) => ({
  ...state,
  oldFilter: state.newFilter,
  newFilter: state.newFilter,
  isDirty: false,
});

export const updateNewFilter = (
  state: State,
  {
    isDirty,
    filter: { key, ...rest },
  }: { isDirty: boolean; filter: SetFilterPayload }
) => ({
  ...state,
  newFilter: { ...state.newFilter, [key]: rest },
  isDirty,
});

export const updateOldFilter = (
  state: State,
  {
    isDirty,
    filter: { key, ...rest },
  }: { isDirty: boolean; filter: SetFilterPayload }
) => ({
  ...state,
  newFilter: { ...state.newFilter, [key]: rest },
  isDirty,
});
