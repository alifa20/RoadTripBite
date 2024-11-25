import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LocationState, PlaceLocation } from "./types";
import functions from "@react-native-firebase/functions";

interface SearchParams {
  lat: number;
  lng: number;
  type: string;
  rating: number;
  userRatingsTotal: number;
}

export const searchLocations = createAsyncThunk(
  "location/searchLocations",
  async (params: SearchParams) => {
    const resp = await functions().httpsCallable<
      SearchParams,
      { results: PlaceLocation[] }
    >("placesOnCall")(params);
    return resp.data.results;
  }
);

const initialState: LocationState = {
  locations: [],
  nextPageToken: "",
  selectedLocation: null,
  showBottomSheet: false,
  loading: false,
  error: null,
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
      state.selectedLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.locations = action.payload;
        state.loading = false;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const {
  setLocations,
  setNextPageToken,
  setSelectedLocation,
  clearLocations,
} = locationSlice.actions;
export default locationSlice.reducer;
