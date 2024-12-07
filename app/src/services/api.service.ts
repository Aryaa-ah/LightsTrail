// src/services/api.service.ts
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/index';

class ApiService {
  private cache = new Map<string, {data: Record<string, unknown>, timestamp: number}>();

  private async fetchWithCache(url: string, cacheDuration: number) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }

    try {
      const response = await axios.get(url);
      this.cache.set(url, {
        data: response.data,
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError);
    }
  }

  private handleApiError(error: AxiosError) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
  }

  async getNoaaData(endpoint: keyof typeof API_CONFIG.NOAA.ENDPOINTS) {
    const url = `${API_CONFIG.NOAA.BASE_URL}${API_CONFIG.NOAA.ENDPOINTS[endpoint]}`;
    return this.fetchWithCache(url, API_CONFIG.NOAA.CACHE_DURATION);
  }

  async getWeatherData(lat: number, lon: number) {
    if (!process.env.VITE_OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured');
    }

    const url = `${API_CONFIG.OPENWEATHER.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.VITE_OPENWEATHER_API_KEY}&units=metric`;
    return this.fetchWithCache(url, API_CONFIG.OPENWEATHER.CACHE_DURATION);
  }
}

export const apiService = new ApiService();