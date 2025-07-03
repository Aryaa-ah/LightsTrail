import { configureStore } from '@reduxjs/toolkit';
import auroraDashboardReducer from './AuroraDashboardSlice';

export const store = configureStore({
  reducer: {
    auroraDashboard: auroraDashboardReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;