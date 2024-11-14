import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockResponse } from "@/mocks/mockLocations";
import { LocationState, PlaceLocation } from "./types";

const initialState: LocationState = {
  // locations: mockResponse.data.results,
  // nextPageToken: mockResponse.data.nextPageToken,
  locations: [],
  nextPageToken: "",
  selectedLocation: null,
  showBottomSheet: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<PlaceLocation[]>) => {
      state.locations = action.payload;
    },
    setNextPageToken: (state, action: PayloadAction<string>) => {
      state.nextPageToken = action.payload;
    },
    setSelectedLocation: (
      state,
      action: PayloadAction<PlaceLocation | null>
    ) => {
      state.selectedLocation = action.payload;
    },
    clearLocations: (state) => {
      state.locations = [];
      state.nextPageToken = null;
      state.selectedLocation = null;
    },
  },
});

export const {
  setLocations,
  setNextPageToken,
  setSelectedLocation,
  clearLocations,
} = locationSlice.actions;
export default locationSlice.reducer;
