import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MAP_TYPES,
  MapType,
  MinRating,
  MinReviewCount,
  MIN_REVIEW_COUNTS,
  MIN_RATINGS,
  TIME_OPTIONS,
} from "./types";

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  searchRadius: number;
  preferredMap: MapType;
  minRating: MinRating;
  minReviewCount: MinReviewCount;
  timeWindow: number;
}

const initialState: SettingsState = {
  darkMode: false,
  notifications: true,
  searchRadius: 5,
  preferredMap: "IN_APP",
  minRating: MIN_RATINGS.FOUR_FIVE,
  minReviewCount: MIN_REVIEW_COUNTS.FORTY,
  timeWindow: TIME_OPTIONS.ONE_HOUR,
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
    setMinReviewCount: (state, action: PayloadAction<MinReviewCount>) => {
      state.minReviewCount = action.payload;
    },
    setTimeWindow: (state, action: PayloadAction<number>) => {
      state.timeWindow = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  toggleNotifications,
  setSearchRadius,
  setPreferredMap,
  setMinRating,
  setMinReviewCount,
  setTimeWindow,
} = settingsSlice.actions;
export default settingsSlice.reducer;
