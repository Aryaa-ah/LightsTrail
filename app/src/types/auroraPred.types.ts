// src/types/auroraPred.types.ts

// types/auroraPred.types.ts
export interface ViewingSpot {
  id: string;
  coordinates: [number, number];
  probability: number;
  kpIndex: number;
  visibility: number;
  cloudCover: number;
  temperature: number;
  rating: number;
  updatedAt: string;
  location: string;
}

export interface PredictionState {
  viewingSpots: ViewingSpot[];
  selectedSpot: ViewingSpot | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface WeatherData {
  cloudCover: number;
  temperature: number;
  visibility: number;
}