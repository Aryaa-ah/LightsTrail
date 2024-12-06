/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/gallery/store/gallerySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import galleryService from "../../../Back-End/service/services/galleryServices";
import type {
  Photo,
  FetchPhotosParams,
  GalleryState,
} from "../types/gallery.types";

const initialState: GalleryState = {
  photos: [],
  loading: false,
  error: null,
  selectedPhoto: null,
  filters: {
    sortBy: "latest",
    visibility: "all",
  },
};

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export const searchPhotosByLocation = createAsyncThunk(
  'gallery/searchPhotosByLocation',
  async (location: string) => {
    // If empty search, use the fetchPhotos endpoint instead
    if (!location.trim()) {
      const response = await fetch(`${BACKEND_URL}/api/gallery/photos`);
      const data: { data: Photo[] } = await response.json() as any;
      return (data as unknown as { data: Photo }).data;
    }

    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos/search?location=${encodeURIComponent(location)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json() as { error: string };
      throw new Error(errorData.error || 'Failed to search photos');
    }

    const data = await response.json() as { data: Photo };
    return data.data;
  }
);

export const fetchPhotos = createAsyncThunk(
  "gallery/fetchPhotos",
  async (params: FetchPhotosParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.userOnly) queryParams.append("userOnly", "true");

    const response = await fetch(
      `http://localhost:3002/api/gallery/photos?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch photos");
    }

    const data = await response.json() as { data: Photo };
    return data.data;
  }
);

export const uploadPhoto = createAsyncThunk(
  "gallery/uploadPhoto",
  async (formData: FormData) => {
    const response = await fetch("http://localhost:3002/api/gallery/photos", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = (error as { message: string }).message || "Upload failed";
      throw new Error(errorMessage);
    }

    const result = await response.json() as { data: Photo };
    return result.data;
  }
);


export const updatePhoto = createAsyncThunk(
  "gallery/updatePhoto",
  async ({
    photoId,
    updates,
  }: {
    photoId: string;
    updates: Partial<Photo>;
  }) => {
    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos/${photoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update photo");
    }

    const data = await response.json() as { data: Photo };
    return data.data;
  }
);

// delete photo
export const deletePhoto = createAsyncThunk(
  "gallery/deletePhoto",
  async ({ photoId, userName }: { photoId: string; userName: string }) => {
    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos/${photoId}`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const errorData = error as { error: string };
      throw new Error(errorData.error || 'Failed to delete photo');
    }

    return photoId;
  }
);

export const getPhotoById = createAsyncThunk(
  "gallery/getPhotoById",
  async (photoId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos/${photoId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch photo");
    }

    const data = await response.json() as { data: Photo };
    return data.data;
  }
);

export const toggleLike = createAsyncThunk(
  "gallery/toggleLike",
  async (photoId: string) => {
    const response = await galleryService.toggleLike(photoId);
    return response;
  }
);
const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSelectedPhoto: (state, action) => {
      state.selectedPhoto = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearPhotos: (state) => {
      state.photos = [];
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
        state.photos = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.error = null;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch photos";
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = [action.payload, ...state.photos];
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Upload failed";
      })
      .addCase(searchPhotosByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPhotosByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.error = null;
      })
      .addCase(searchPhotosByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        // Update photo in state
        const index = state.photos.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.photos[index] = action.payload;
        }
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photos = state.photos.filter(
          (photo) => photo.id !== action.payload
        );
      });
  },
});

export const { setSelectedPhoto, updateFilters, resetFilters, clearPhotos } =
  gallerySlice.actions;
export default gallerySlice.reducer;
