// src/contexts/LocationContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (location) {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};