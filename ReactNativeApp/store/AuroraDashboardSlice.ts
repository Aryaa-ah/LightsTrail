// store/AuroraDashboardSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../config";

// Define your AuroraData and AuroraState types
interface AuroraData {
  kpIndex: string;
  bz: string;
  speed: string;
  temperature: string;
  precipitation: string;
  windSpeed: string;
  cloudCover: string;
  isDay: string;
  probability: string;
  uvIndex: string;
}

interface AuroraState {
  data: AuroraData;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuroraState = {
  data: {
    kpIndex: "-",
    bz: "-",
    speed: "-",
    temperature: "-",
    precipitation: "-",
    windSpeed: "-",
    cloudCover: "-",
    isDay: "-",
    probability: "-",
    uvIndex: "-"
  },
  loading: false,
  error: null
};

// Type guard to validate data
function isAuroraData(data: any): data is AuroraData {
  return data &&
    typeof data.kpIndex === "string" &&
    typeof data.bz === "string" &&
    typeof data.speed === "string" &&
    typeof data.temperature === "string" &&
    typeof data.precipitation === "string" &&
    typeof data.windSpeed === "string" &&
    typeof data.uvIndex === "string";
}

// Thunk that accepts coordinates
export const fetchAuroraData = createAsyncThunk(
  "aurora/fetchData",
  async (
    { latitude, longitude }: { latitude: number; longitude: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
  `${API_BASE_URL}/auroraforecast?longitude=${longitude}&latitude=${latitude}`
);

      if (!response.ok) {
        throw new Error("Failed to fetch aurora data");
      }

      const data = await response.json();

      if (!isAuroraData(data)) {
        return rejectWithValue("Invalid data structure");
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

const auroraSlice = createSlice({
  name: "aurora",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuroraData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuroraData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAuroraData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "An error occurred";
      });
  },
});

export default auroraSlice.reducer;