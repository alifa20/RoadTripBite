import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import locationReducer from './locationSlice';
import odometerReducer from './odometerSlice';
import { photoApi } from './api/photoApi';
import { placeApi } from './api/placeApi';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    location: locationReducer,
    odometer: odometerReducer,
    [photoApi.reducerPath]: photoApi.reducer,
    [placeApi.reducerPath]: placeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(photoApi.middleware, placeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
