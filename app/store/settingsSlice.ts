import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  searchRadius: number;
}

const initialState: SettingsState = {
  darkMode: false,
  notifications: true,
  searchRadius: 5,
};

const settingsSlice = createSlice({
  name: 'settings',
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
  },
});

export const { toggleDarkMode, toggleNotifications, setSearchRadius } = settingsSlice.actions;
export default settingsSlice.reducer;
