import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
}

const LocationDialogPopUp: React.FC<LocationDialogPopUpProps> = ({ 
  open, 
  onClose, 
  setLocation,
  onLocationSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (value: string) => {
    setSuggestions([]);
    setError(null);

    if (value.trim() === '') {
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
      setError('Unable to fetch locations. Please try again.');
      setSuggestions([]);
    }
  }, []);

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
            city_country: 'Current Location',
            latitude,
            longitude,
          };
          setSelectedLocation(currentLocation);
          onLocationSelect?.(currentLocation);
          setLocation({
            city_country: "Current Location", 
            latitude: 0,
            longitude: 0,
          });
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Search Location</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              sx={{marginTop:'20px'}}
                {...params}
                label="Search for a location"
                variant="outlined"
                error={Boolean(error)}
                helperText={error || ''}
              />
            )}
            loadingText="Loading..."
            noOptionsText="No locations found"
          />

          <Box>
            <Button 
              variant="contained" 
              onClick={getCurrentLocation} 
              startIcon={<LocationOnIcon />}
            >
              Use Current Location
            </Button>
          </Box>

          {/* Show selected location */}
          {selectedLocation && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <p>Selected: {selectedLocation.city_country}</p>
              <p>Latitude: {selectedLocation.latitude}</p>
              <p>Longitude: {selectedLocation.longitude}</p>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialogPopUp;
