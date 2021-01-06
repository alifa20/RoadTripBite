import { initialState } from "./initialState";
import {
  updateNewFilter,
  setIsDirty,
  setFilter,
  setOldFilter,
} from "./stateHandler";
import { Action } from "./types";

export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "SET_IS_DIRTY":
      return setIsDirty(state, action.payload);

    case "SET_FILTER":
      return setFilter(state, action.payload);

    case "SAVE_OLD_FILTER":
      return setOldFilter(state);

    case "UPDATE_FILTER":
      return updateNewFilter(state, action.payload);

    default:
      return state;
  }
};
