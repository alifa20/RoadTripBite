import { State } from "./types";

export const selectIsDirty = (appState: State) => appState.isDirty;
