import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuroraPopup from './AuroraInfoPopup';

// Dummy async fetch
export const fetchAuroraData = createAsyncThunk(
  'auroraDashboard/fetchAuroraData',
  async () => {
    // Replace with real API call if needed
    return {
      kpIndex: 3,
      temperature: -5,
      humidity: 70,
      pressure: 1010,
    };
  }
);

interface AuroraState {
  data: {
    kpIndex: number;
    temperature: number;
    humidity: number;
    pressure: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuroraState = {
  data: {
    kpIndex: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
  },
  loading: false,
  error: null,
};

const auroraDashboardSlice = createSlice({
  name: 'auroraDashboard',
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
        state.error = action.error.message || 'Error';
      });
  },
});

export default auroraDashboardSlice.reducer;