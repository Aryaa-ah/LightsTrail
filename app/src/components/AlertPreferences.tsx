import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface AlertPreferencesState {
  kpThreshold: number;
  isEnabled: boolean;
  email: string;
}

interface AlertPreferencesProps {
  location: Location; // Add this prop to receive location from parent
}

const AlertPreferencesComponent: React.FC<AlertPreferencesProps> = ({ location }) => {
  const [preferences, setPreferences] = useState<AlertPreferencesState>({
    kpThreshold: 5,
    isEnabled: true,
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user's email from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3002/api/alerts/preferences', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPreferences(prev => ({
            ...prev,
            ...data.data,
            email: user.email
          }));
        }
      } catch (error) {
        setError('Failed to load preferences');
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user.email]);

  const handleSave = async () => {
    try {
      // Check if global location is set
      if (!location || !location.latitude || !location.longitude) {
        setError('Please select a location from the main menu first');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      
      const preferencesData = {
        ...preferences,
        email: user.email,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          cityName: location.city_country
        }
      };

      const response = await fetch('http://localhost:3002/api/alerts/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferencesData)
      });

      if (response.ok) {
        setSuccess('Preferences saved successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save preferences');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save preferences');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Render location warning if no location is selected
  const renderLocationInfo = () => {
    if (!location || !location.city_country) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please select a location from the main menu first
        </Alert>
      );
    }
    return (
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Location</Typography>
        <Typography variant="body2" color="text.secondary">
          Alerts will be sent based on your selected location: {location.city_country}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Aurora Alert Preferences
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderLocationInfo()}

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Enable Aurora Alerts</Typography>
          <Switch
            checked={preferences.isEnabled}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              isEnabled: e.target.checked
            }))}
            color="primary"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Kp Index Threshold</Typography>
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

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !location}
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)',
            color: 'black',
            '&:hover': {
              background: 'linear-gradient(45deg, #84fab0 40%, #8fd3f4 100%)',
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlertPreferencesComponent;