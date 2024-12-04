import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Direction = {
  name: string;
  symbol: string;
  range: [number, number];
};

export const DIRECTIONS: Direction[] = [
  { name: "N", symbol: "↑", range: [337.5, 22.5] },
  { name: "NE", symbol: "↗", range: [22.5, 67.5] },
  { name: "E", symbol: "→", range: [67.5, 112.5] },
  { name: "SE", symbol: "↘", range: [112.5, 157.5] },
  { name: "S", symbol: "↓", range: [157.5, 202.5] },
  { name: "SW", symbol: "↙", range: [202.5, 247.5] },
  { name: "W", symbol: "←", range: [247.5, 292.5] },
  { name: "NW", symbol: "↖", range: [292.5, 337.5] },
];

interface OdometerState {
  speed: number;
  speedList: number[];
  avgSpeed: number;
  heading: number;
  direction: Direction;
  compassDirection: string;
  headingManual: boolean;
  mode: "walking" | "driving";
  isCenteringEnabled: boolean;
}

const initialState: OdometerState = {
  speed: 0,
  speedList: [],
  avgSpeed: 0,
  heading: -1,
  headingManual: false,
  compassDirection: "N",
  mode: "walking",
  direction: DIRECTIONS[0],
  isCenteringEnabled: true,
};

const odometerSlice = createSlice({
  name: "odometer",
  initialState,
  reducers: {
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
      // Update mode based on speed
      // if (state.speed <= 40) {
      //   state.mode = "walking";
      // } else {
      //   state.mode = "driving";
      // }
    },
    setAvgSpeed: (state, action: PayloadAction<number>) => {
      state.avgSpeed = action.payload;
      // Update mode based on speed
      if (state.avgSpeed <= 40) {
        state.mode = "walking";
      } else {
        state.mode = "driving";
      }
    },
    setSpeedList: (state, action: PayloadAction<number>) => {
      const newList = [...state.speedList, action.payload];
      state.speedList = newList.slice(-100);
    },
    setHeading: (state, action: PayloadAction<number>) => {
      state.heading = action.payload;
    },

    setHeadingManual: (state, action: PayloadAction<boolean>) => {
      state.headingManual = action.payload;
    },
    setCompassDirection: (state, action: PayloadAction<string>) => {
      state.compassDirection = action.payload;
    },
    setDirection: (state, action: PayloadAction<Direction>) => {
      state.direction = action.payload;
    },
    setIsCenteringEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCenteringEnabled = action.payload;
      // if (action.payload) {
        state.headingManual = !action.payload;
      // }
    },
  },
});

export const {
  setSpeed,
  setHeading,
  setDirection,
  setCompassDirection,
  setAvgSpeed,
  setHeadingManual,
  setIsCenteringEnabled,
} = odometerSlice.actions;
export default odometerSlice.reducer;
