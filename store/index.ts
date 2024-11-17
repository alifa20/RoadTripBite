import { configureStore } from "@reduxjs/toolkit";
import { helloApi } from "./api/helloApi";
import { photoApi } from "./api/photoApi";
import { placeApi } from "./api/placeApi";
import locationReducer from "./locationSlice";
import odometerReducer from "./odometerSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    location: locationReducer,
    odometer: odometerReducer,
    [photoApi.reducerPath]: photoApi.reducer,
    [placeApi.reducerPath]: placeApi.reducer,
    [helloApi.reducerPath]: helloApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(photoApi.middleware, placeApi.middleware, helloApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
