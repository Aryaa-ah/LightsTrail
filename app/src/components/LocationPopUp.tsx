import React, { useState, useCallback } from 'react';
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
  mapboxAccessToken: string;
}

const LocationDialogPopUp: React.FC<LocationDialogPopUpProps> = ({
  open,
  onClose,
  setLocation,
  onLocationSelect,
  mapboxAccessToken,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapMode, setIsMapMode] = useState(false);
  const [mapLocation, setMapLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [viewport, setViewport] = useState({
    latitude: 40.7128, // Default to New York City
    longitude: -74.0060,
    zoom: 10,
  });

  const fetchSuggestions = useCallback(async (value: string) => {
    setSuggestions([]);
    setError(null);

    if (value.trim() === '' || value === t('locationDialogPopUp.currentLocation')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3002/longitudeLatitude/${value}`);
      if (!response.ok) throw new Error('Failed to fetch location suggestions');

      const data = await response.json();
      setLoading(false);
      setSuggestions(data.suggestions || data);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLoading(false);
      setSuggestions([]);
    }
  }, [t]);

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleLocationSelect = (event: React.SyntheticEvent, value: Location | null) => {
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
            city_country: t('locationDialogPopUp.currentLocation'),
            latitude,
            longitude,
          };
          setSelectedLocation(currentLocation);
          onLocationSelect?.(currentLocation);
          setLocation(currentLocation);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t('locationDialogPopUp.geolocationError'));
        }
      );
    } else {
      setError(t('locationDialogPopUp.geolocationUnsupported'));
    }
  };

  const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setMapLocation({ longitude: lng, latitude: lat });
  };

  const confirmMapLocation = async () => {
    if (mapLocation) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${mapLocation.longitude},${mapLocation.latitude}.json?access_token=${mapboxAccessToken}`
        );
        const data = await response.json();
        const cityCountry = data.features[0]?.place_name || t('locationDialogPopUp.defaultLocation');
        const location: Location = {
          city_country: cityCountry,
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
        };
        setSelectedLocation(location);
        setLocation(location);
        onLocationSelect?.(location);
        setIsMapMode(false);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        const fallbackLocation: Location = {
          city_country: t('locationDialogPopUp.defaultLocation'),
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
        };
        setSelectedLocation(fallbackLocation);
        setLocation(fallbackLocation);
        onLocationSelect?.(fallbackLocation);
        setIsMapMode(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isMapMode ? t('locationDialogPopUp.title.mapMode') : t('locationDialogPopUp.title.searchMode')}
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
                    {...params}
                    label={t('locationDialogPopUp.searchPlaceholder')}
                    variant="outlined"
                    helperText={error || ''}
                  />
                )}
                loadingText={t('locationDialogPopUp.loading')}
                noOptionsText={t('locationDialogPopUp.noOptions')}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={getCurrentLocation}
                  startIcon={<LocationOnIcon />}
                >
                  {t('locationDialogPopUp.currentLocation')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsMapMode(true)}
                  startIcon={<MapIcon />}
                >
                  {t('locationDialogPopUp.selectFromMap')}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ height: '400px', width: '100%' }}>
              <Map
                initialViewState={{ ...viewport }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxAccessToken}
                onClick={handleMapClick}
              >
                {mapLocation && (
                  <Marker longitude={mapLocation.longitude} latitude={mapLocation.latitude} />
                )}
              </Map>
            </Box>
          )}

          {selectedLocation && !isMapMode && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <p>{t('locationDialogPopUp.selected')}: {selectedLocation.city_country}</p>
              <p>{t('locationDialogPopUp.latitude')}: {selectedLocation.latitude}</p>
              <p>{t('locationDialogPopUp.longitude')}: {selectedLocation.longitude}</p>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isMapMode ? (
          <>
            <Button onClick={() => setIsMapMode(false)} color="primary">
              {t('locationDialogPopUp.buttons.cancel')}
            </Button>
            <Button onClick={confirmMapLocation} color="primary" disabled={!mapLocation}>
              {t('locationDialogPopUp.buttons.confirm')}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            {t('locationDialogPopUp.buttons.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialogPopUp;
