// src/types/auroraPredictionService.d.ts

declare module '../../../Back-End/service/services/auroraPredictionService.js' {
  export interface ViewingSpot {
    id: string;
    coordinates: [number, number];
    probability: number;
    kpIndex: number;
    solarWindSpeed: number;
    bzComponent: number;
    visibility: number;
    cloudCover: number;
    temperature: number;
    rating: number;
    updatedAt: string;
    location: string;
  }

  class AuroraPredictionService {
    generatePredictions(): Promise<ViewingSpot[]>;
    // Add other methods if needed
  }

  const service: AuroraPredictionService;
  export default service;
}