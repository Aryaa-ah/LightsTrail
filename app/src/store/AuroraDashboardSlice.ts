import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuroraData, AuroraState } from '../types/auroraDashboard';

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

// Type guard to check if the data matches AuroraData
function isAuroraData(data: any): data is AuroraData {
  return data && 
    typeof data.kpIndex === 'string' &&
    typeof data.bz === 'string' &&
    typeof data.speed === 'string' &&
    typeof data.temperature === 'string' &&
    typeof data.precipitation === 'string' &&
    typeof data.windSpeed === 'string' &&
    typeof data.uvIndex === 'string';
}

// Async thunk for fetching aurora data
export const fetchAuroraData = createAsyncThunk(
  'aurora/fetchData',
  async ({ latitude, longitude }: { latitude: number, longitude: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3002/auroraforecast?longitude=${longitude}&latitude=${latitude}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch aurora data');
      }
      
      const data = await response.json();
      
      // Validate the data using type guard
      if (!isAuroraData(data)) {
        return rejectWithValue('Invalid data structure');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Create the slice
const auroraSlice = createSlice({
  name: 'aurora',
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
        state.error = action.payload as string || 'An error occurred';
      });
  }
});

export default auroraSlice.reducer;