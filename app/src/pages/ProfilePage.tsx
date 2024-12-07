import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import { DeleteOutline, EmailOutlined, PersonOutline, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import AlertPreferencesComponent from '../components/AlertPreferences';  

import { useLocation } from '../contexts/LocationContext';

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedLocation') {
        const newLocation = e.newValue ? JSON.parse(e.newValue) : null;
        setLocation(newLocation);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: "100px" }}>
      <Container maxWidth="md">
        <Box
          sx={{
            background: `linear-gradient(145deg, 
              ${alpha('#1a237e', 0.4)} 0%, 
              ${alpha('#0d47a1', 0.4)} 50%,
              ${alpha('#311b92', 0.4)} 100%)`,
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 4,
              pb: 8,
              background: `linear-gradient(to bottom, 
                ${alpha(theme.palette.primary.dark, 0.3)}, 
                transparent)`,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.primary.main,
                fontSize: '3rem',
                margin: '0 auto',
                border: `4px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            >
              {user?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 3,
                mb: 1,
                background: 'linear-gradient(45deg, #e3f2fd 30%, #90caf9 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <EmailOutlined fontSize="small" />
              {user?.email}
            </Typography>
            
            {/* Location Display */}
            <Typography 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mt: 2
              }}
            >
              <LocationOn fontSize="small" />
              {location ? location.city_country : 'No location selected'}
            </Typography>
          </Box>

          {/* Form Fields */}
          <Box sx={{ px: 4, pb: 4 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 3,
              mb: 4 
            }}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: alpha(theme.palette.common.white, 0.7)
                  }}
                >
                  <PersonOutline fontSize="small" />
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  value={user?.firstName}
                  disabled
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha(theme.palette.common.black, 0.2),
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: alpha(theme.palette.common.white, 0.7)
                  }}
                >
                  <PersonOutline fontSize="small" />
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  value={user?.lastName}
                  disabled
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha(theme.palette.common.black, 0.2),
                      '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Add Divider before Alert Preferences */}
            <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

            {/* Alert Preferences Section */}
            {location ? (
              <AlertPreferencesComponent location={location} />
            ) : (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 4,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  '& .MuiAlert-icon': {
                    color: theme.palette.warning.main
                  }
                }}
              >
                Please select a location from the main menu to set up alert preferences
              </Alert>
            )}

            {/* Add Divider after Alert Preferences */}
            <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

            {/* Delete Account Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              mt: 6
            }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialog(true)}
                startIcon={<DeleteOutline />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #d32f2f 30%, #b71c1c 90%)',
                  }
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => !loading && setOpenDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteOutline color="error" />
              <Typography variant="h6">Delete Account</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot be undone 
              and will permanently delete all your data.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setOpenDialog(false)} 
              disabled={loading}
              sx={{ borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteOutline />}
              sx={{
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #d32f2f 30%, #b71c1c 90%)',
                }
              }}
            >
              {loading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProfilePage;