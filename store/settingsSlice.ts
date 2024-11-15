import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAP_TYPES, MapType, MinRating } from "./types";

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  searchRadius: number;
  preferredMap: MapType;
  minRating: MinRating;
}

const initialState: SettingsState = {
  darkMode: false,
  notifications: true,
  searchRadius: 5,
  preferredMap: "IN_APP",
  minRating: 4.5,
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
    setMinRating: (state, action: PayloadAction<MinRating>) => {
      state.minRating = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  toggleNotifications,
  setSearchRadius,
  setPreferredMap,
  setMinRating,
} = settingsSlice.actions;
export default settingsSlice.reducer;
