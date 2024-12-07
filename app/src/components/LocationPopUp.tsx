import React, { useState, useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';

// Mapbox imports
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface LocationDialogPopUpProps {
  open: boolean;
  onClose: () => void;
  setLocation: (location: Location) => void;
  onLocationSelect?: (location: Location) => void;
  mapboxAccessToken: string; // Add Mapbox access token as a prop
}

const LocationDialogPopUp: React.FC<LocationDialogPopUpProps> = ({ 
  open, 
  onClose, 
  setLocation,
  onLocationSelect,
  mapboxAccessToken
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();
  // New state for map selection
  const [isMapMode, setIsMapMode] = useState(false);
  const [mapLocation, setMapLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Viewport state for Mapbox
  const [viewport, setViewport] = useState({
    latitude: 40.7128, // Default to New York City
    longitude: -74.0060,
    zoom: 10
  });

  const fetchSuggestions = useCallback(async (value: string) => {
    setSuggestions([]);
    setError(null);

    if (value.trim() === '' || value === 'Current Location') {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3002/longitudeLatitude/${value}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      
      setLoading(false);
      setSuggestions(data.suggestions || data);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLoading(false);
     // setError('Unable to fetch locations. Please try again.');
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleLocationSelect = (event: React.SyntheticEvent, value: Location | null) => {
    console.log(event, value);
    setSelectedLocation(value);
    
    if (value) {
      onLocationSelect?.(value);
      setLocation(value);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const currentLocation: Location = {
            city_country: 'Current Location',
            latitude,
            longitude,
          };
          setSelectedLocation(currentLocation);
          onLocationSelect?.(currentLocation);
          setLocation(currentLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to retrieve location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setMapLocation({ longitude: lng, latitude: lat });
  };

  const confirmMapLocation = async () => {
    if (mapLocation) {
      // Optionally, you can reverse geocode to get city/country
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${mapLocation.longitude},${mapLocation.latitude}.json?access_token=pk.eyJ1Ijoic2lkNzMyIiwiYSI6ImNtNGNjMWcxajBhOG8yaXB6Nmxka2ZoazIifQ.-VDkqKwQTD476C9cm31S8w`
        );
        const data = await response.json();
        
        const cityCountry = data.features[0]?.place_name || 'Selected Location';
        
        const location: Location = {
          city_country: cityCountry,
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude
        };

        setSelectedLocation(location);
        setLocation(location);
        onLocationSelect?.(location);
        setIsMapMode(false);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        // Fallback if reverse geocoding fails
        const location: Location = {
          city_country: 'Selected Location',
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude
        };
        setSelectedLocation(location);
        setLocation(location);
        onLocationSelect?.(location);
        setIsMapMode(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isMapMode ? 'Select Location on Map' : 'Search Location'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!isMapMode ? (
            <>
              <Autocomplete
                freeSolo={false}
                options={suggestions}
                getOptionLabel={(option: Location) => option.city_country}
                loading={loading}
                value={selectedLocation}
                onInputChange={handleInputChange}
                onChange={handleLocationSelect}
                renderInput={(params) => (
                  <TextField
                    sx={{ marginTop: '20px' }}
                    {...params}
                    label={t("locationDialogPopUp.searchPlaceholder")}
                    variant="outlined"
                   // error={Boolean(error)}
                    helperText={error || ''}
                  />
                )}
                loadingText="Loading..."
                noOptionsText="No locations found"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={getCurrentLocation} 
                  startIcon={<LocationOnIcon />}
                >
                  Use Current Location
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsMapMode(true)}
                  startIcon={<MapIcon />}
                >
                  Select from Map
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ height: '400px', width: '100%' }}>
              <Map
                initialViewState={{
                  ...viewport,
                  width: '100%',
                  height: '100%'
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxAccessToken}
                onClick={handleMapClick}
              >
                {mapLocation && (
                  <Marker 
                    longitude={mapLocation.longitude} 
                    latitude={mapLocation.latitude}
                  />
                )}
              </Map>
            </Box>
          )}

          {/* Show selected location */}
          {selectedLocation && !isMapMode && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <p>{t("locationDialogPopUp.selected")}: {selectedLocation.city_country}</p>
              <p>{t("locationDialogPopUp.latitude")}: {selectedLocation.latitude}</p>
              <p>{t("locationDialogPopUp.longitude")}: {selectedLocation.longitude}</p>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isMapMode ? (
          <>
            <Button onClick={() => setIsMapMode(false)} color="primary">
            {t("locationDialogPopUp.buttons.cancel")}
            </Button>
            <Button 
              onClick={confirmMapLocation} 
              color="primary" 
              disabled={!mapLocation}
            >
             {t("locationDialogPopUp.buttons.confirm")}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            {t("locationDialogPopUp.buttons.close")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialogPopUp;

