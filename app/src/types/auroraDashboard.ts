export interface AuroraData {
    kpIndex: string;
    bz: string;
    speed: string;
    temperature: string;
    precipitation: string;
    windSpeed: string;
    uvIndex: string;
  }
  
  export interface AuroraState {
    data: AuroraData;
    loading: boolean;
    error: string | null;
  }