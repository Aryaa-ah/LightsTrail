export interface Photo {
  id: string;
  url: string;
  location: string;
  userName: string;
  userId: string;
  createdAt: string;
  description?: string;
}

export interface GalleryState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  selectedPhoto: Photo | null;
  filters: GalleryFilters;
}

export interface FetchPhotosParams {
  userOnly?: boolean;
}

export interface FetchPhotosResponse {
  photos: Photo[];
}

export interface GalleryFilters {
  sortBy: "latest" | "popular" | "oldest";
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  visibility?: "all" | "public" | "private";
}
