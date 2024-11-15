import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OdometerState {
  speed: number;
  heading: number;
  compassDirection: string;
  mode: "walking" | "driving";
}

const initialState: OdometerState = {
  speed: 0,
  heading: -1,
  compassDirection: "N",
  mode: "walking",
};

const odometerSlice = createSlice({
  name: "odometer",
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
      // Update mode based on speed
      if (state.speed <= 40) {
        state.mode = "walking";
      } else {
        state.mode = "driving";
      }
    },
    setHeading: (state, action: PayloadAction<number>) => {
      state.heading = action.payload;
    },
    setCompassDirection: (state, action: PayloadAction<string>) => {
      state.compassDirection = action.payload;
    },
  },
});

export const { setSpeed, setHeading, setCompassDirection } = odometerSlice.actions;
export default odometerSlice.reducer;
