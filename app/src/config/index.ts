// src/config/index.ts

// Constants for environment variables
const ENV_VARS = {
  API_URL: import.meta.env.VITE_API_URL,
  AUTH_URL: import.meta.env.VITE_AUTH_URL,
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  NOAA_API_ENDPOINT: import.meta.env.VITE_NOAA_API_ENDPOINT,
};

// Required environment variables
const REQUIRED_ENV_VARS = ['VITE_OPENWEATHER_API_KEY'];

// Validate environment variables
const validateEnvVars = () => {
  const missingVars = REQUIRED_ENV_VARS.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(
      '\x1b[33m%s\x1b[0m', // Yellow color
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'You can copy .env.example to .env and fill in your values.'
    );
    
    if (import.meta.env.MODE === 'production') {
      throw new Error('Missing required environment variables in production');
    }
  }
  
  return missingVars.length === 0;
};

// Call validation
const isEnvValid = validateEnvVars();

export const config = {
  apiUrl: ENV_VARS.API_URL || "http://localhost:3002",
  authUrl: ENV_VARS.AUTH_URL || "http://localhost:3002/auth",
  openWeatherApiKey: ENV_VARS.OPENWEATHER_API_KEY,
  noaaApiEndpoint: ENV_VARS.NOAA_API_ENDPOINT || "https://services.swpc.noaa.gov/json/",
  isEnvValid,
};

export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiUrl}${endpoint}`;
};
