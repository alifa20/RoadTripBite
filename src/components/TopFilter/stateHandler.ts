import { initialState } from "./initialState";
import { Filter, SetFilterPayload, State } from "./types";

export const setIsDirty = (
  state: State,
  { isDirty }: { isDirty: boolean }
) => ({
  ...state,
  isDirty,
});

export const clearFilter = (state: State) => initialState;

export const updateFilter = (
  state: State,
  {
    isDirty,
    filter: { key, ...rest },
  }: { isDirty: boolean; filter: SetFilterPayload }
) => ({
  ...state,
  filter: { ...state.filter, [key]: rest },
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
  filter: { ...state.filter, [key]: rest },
  isDirty,
});
