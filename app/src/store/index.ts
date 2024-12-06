import { configureStore } from "@reduxjs/toolkit";
import galleryReducer from "./gallerySlice";
import authReducer from "../store/authSice";
import auroraPredictionReducer from "./AuroraPredSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
    auroraPrediction: auroraPredictionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
