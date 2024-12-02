export interface Photo {
  id: string;
  url: string;
  location: string;
  userName: string;
  userId: string;
  visibility: string;
  likes: number;
  createdAt: string;
  description?: string;   
  isLikedByUser?: boolean;
}

export interface GalleryState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  currentPage?: number;
  totalPages?: number;
  selectedPhoto: Photo | null;
  filters: GalleryFilters;
}

export interface FetchPhotosParams {
  page?: number;
  limit?: number;
  userOnly?: boolean;
}

export interface FetchPhotosResponse {
  photos: Photo[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalPhotos: number;
  };
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
