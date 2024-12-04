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

    const data = await response.json();
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
      throw new Error(error.message || "Upload failed");
    }

    const result = await response.json();
    return result.data;
  }
);

export const searchPhotosByLocation = createAsyncThunk(
  "gallery/searchPhotosByLocation",
  async (location: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos?location=${encodeURIComponent(
        location
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to search photos");
    }

    const data = await response.json();
    return data.data;
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

    const data = await response.json();
    return data.data;
  }
);

export const deletePhoto = createAsyncThunk(
  "gallery/deletePhoto",
  async (photoId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/gallery/photos/${photoId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete photo");
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

    const data = await response.json();
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
        state.photos = action.payload;
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
      .addCase(searchPhotosByLocation.fulfilled, (state, action) => {
        state.photos = action.payload;
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
