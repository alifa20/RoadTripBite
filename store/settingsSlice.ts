import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAP_TYPES, MapType } from "./types";

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  searchRadius: number;
  preferredMap: MapType;
}

const initialState: SettingsState = {
  darkMode: false,
  notifications: true,
  searchRadius: 5,
  preferredMap: "IN_APP",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
    },
    setPreferredMap: (state, action: PayloadAction<MapType>) => {
      state.preferredMap = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  toggleNotifications,
  setSearchRadius,
  setPreferredMap,
} = settingsSlice.actions;
export default settingsSlice.reducer;
