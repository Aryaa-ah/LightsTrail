import React, { useState, useEffect } from 'react';
import {
  Typography,
  Slider,
  Switch,
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Autocomplete,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface AlertPreference {
  kpThreshold: number;
  isEnabled: boolean;
  location: {
    cityName: string;
    latitude: number;
    longitude: number;
  } | null;
}

const AlertPreferencesComponent = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [preferences, setPreferences] = useState<AlertPreference>({
    kpThreshold: 5,
    isEnabled: true,
    location: null
  });
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasExistingPreferences, setHasExistingPreferences] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch existing preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3002/api/alerts/preferences', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setPreferences({
              kpThreshold: data.data.kpThreshold,
              isEnabled: data.data.isEnabled,
              location: data.data.location
            });
            setHasExistingPreferences(true);
          }
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        setError(t('alerts.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [t]);

  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/longitudeLatitude/${query}`);
      if (!response.ok) throw new Error(t('alerts.locationSearchError'));
      
      const data = await response.json();
      if (data.suggestions) {
        setLocationSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setError(t('alerts.locationSearchError'));
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences.location) {
      setError(t('alerts.locationRequired'));
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const requestBody = {
        kpThreshold: preferences.kpThreshold,
        email: user.email,
        location: {
          cityName: preferences.location.cityName,
          latitude: preferences.location.latitude,
          longitude: preferences.location.longitude
        },
        isEnabled: preferences.isEnabled
      };

      const method = hasExistingPreferences ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:3002/api/alerts/preferences', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setSuccess(t('alerts.saveSuccess'));
        setHasExistingPreferences(true);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(t('alerts.saveError'));
      }
    } catch (error) {
      setError(t('alerts.saveError'));
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationInput) {
        handleLocationSearch(locationInput);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationInput]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        {t('alerts.title')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom sx={{ color: 'white' }}>
          {t('alerts.locationLabel')}
        </Typography>
        <Autocomplete
          options={locationSuggestions}
          getOptionLabel={(option) => option.city_country}
          value={preferences.location ? {
            city_country: preferences.location.cityName,
            latitude: preferences.location.latitude,
            longitude: preferences.location.longitude
          } as Location : null}
          onChange={(_, value) => {
            if (value) {
              setPreferences(prev => ({
                ...prev,
                location: {
                  cityName: value.city_country,
                  latitude: value.latitude,
                  longitude: value.longitude
                }
              }));
            }
          }}
          onInputChange={(_, value) => setLocationInput(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('alerts.searchLocation')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom sx={{ color: 'white' }}>
          {t('alerts.kpThreshold')}
        </Typography>
        <Slider
          value={preferences.kpThreshold}
          onChange={(_, value) => setPreferences(prev => ({
            ...prev,
            kpThreshold: value as number
          }))}
          min={0}
          max={9}
          step={1}
          marks
          valueLabelDisplay="auto"
          disabled={!preferences.isEnabled}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.isEnabled}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                isEnabled: e.target.checked
              }))}
            />
          }
          label={<Typography sx={{ color: 'white' }}>{t('alerts.enableAlerts')}</Typography>}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSavePreferences}
        disabled={loading}
        fullWidth
        startIcon={<NotificationsActive />}
      >
        {loading ? <CircularProgress size={24} /> : t('alerts.savePreferences')}
      </Button>
    </Box>
  );
};

export default AlertPreferencesComponent;