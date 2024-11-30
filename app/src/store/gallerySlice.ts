// src/features/gallery/store/gallerySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import galleryService from "../../../Back-End/service/services/galleryServices";
import type {
  Photo,
  FetchPhotosParams,
  GalleryState, // Import GalleryState instead of declaring it
  // GalleryFilters
} from "../types/gallery.types";

// Initial state
const initialState: GalleryState = {
  photos: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  selectedPhoto: null,
  filters: {
    visibility: "public",
    sortBy: "latest",
  },
};

// Async thunks for API calls
export const fetchPhotos = createAsyncThunk(
  "gallery/fetchPhotos",
  async (params: FetchPhotosParams) => {
    const response = await galleryService.getPhotos(params.page, params.limit);
    return response;
  }
);

export const uploadPhoto = createAsyncThunk(
  "gallery/uploadPhoto",
  async (data: FormData) => {
    const response = await fetch("/api/gallery/photos", {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to upload photo");
    }

    const result = await response.json();
    return {
      ...result.data,
      url: `${window.location.origin}${result.data.url}`,
    };
  }
);

export const deletePhoto = createAsyncThunk(
  "gallery/deletePhoto",
  async (photoId: string) => {
    await galleryService.deletePhoto(photoId);
    return photoId;
  }
);

export const toggleLike = createAsyncThunk(
  "gallery/toggleLike",
  async (photoId: string) => {
    const response = await galleryService.toggleLike(photoId);
    return response;
  }
);

// Create the slice
const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSelectedPhoto: (state, action: PayloadAction<Photo | null>) => {
      state.selectedPhoto = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.currentPage = 1;
    },
    clearPhotos: (state) => {
      state.photos = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos =
          state.currentPage === 1
            ? action.payload.photos
            : [...state.photos, ...action.payload.photos];
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.currentPage;
        state.error = null;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch photos";
        console.error("Fetch photos error:", action.error);
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.photos.unshift(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload photo";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.photos.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.photos[index] = action.payload;
        }
        if (state.selectedPhoto?.id === action.payload.id) {
          state.selectedPhoto = action.payload;
        }
      });
  },
});

export const { setSelectedPhoto, updateFilters, clearPhotos, resetFilters } =
  gallerySlice.actions;
export default gallerySlice.reducer;
