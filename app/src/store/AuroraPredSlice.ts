// src/store/AuroraPredSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auroraService from "../services/auroraService";
import type { ViewingSpot } from "../types/auroraPred.types";

// Define the state interface
interface PredictionState {
  viewingSpots: ViewingSpot[];
  selectedSpot: ViewingSpot | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Define initial state with proper typing
const initialState: PredictionState = {
  viewingSpots: [],
  selectedSpot: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchViewingSpots = createAsyncThunk(
  "auroraPrediction/fetchViewingSpots",
  async (_, { rejectWithValue }) => {
    try {
      const predictions = await auroraService.getPredictions();
      return predictions;
    } catch (error) {
      console.error("Prediction fetch error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch predictions"
      );
    }
  }
);

const auroraPredictionSlice = createSlice({
  name: "auroraPrediction",
  initialState, // This line was causing the error
  reducers: {
    setSelectedSpot: (state, action) => {
      state.selectedSpot = action.payload;
    },
    clearSelectedSpot: (state) => {
      state.selectedSpot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchViewingSpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchViewingSpots.fulfilled, (state, action) => {
        state.loading = false;
        state.viewingSpots = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchViewingSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSpot, clearSelectedSpot } =
  auroraPredictionSlice.actions;
export default auroraPredictionSlice.reducer;
