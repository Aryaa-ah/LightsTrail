import React, { useState } from "react";
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

import { DeleteOutline, EmailOutlined, PersonOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import AlertPreferencesComponent from '../components/AlertPreferences';

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            bgcolor: 'rgba(10, 25, 41, 0.7)',
            borderRadius: '16px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#2196f3',
                fontSize: '3rem',
                margin: '0 auto',
                border: '4px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {user?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ mt: 3, mb: 1, color: 'white' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1 
            }}>
              <EmailOutlined fontSize="small" />
              {user?.email}
            </Typography>
          </Box>

          {/* Profile Content */}
          <Box sx={{ p: 4 }}>
            {/* User Details */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 3, 
              mb: 4 
            }}>
              <Box>
                <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  value={user?.firstName}
                  disabled
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  value={user?.lastName}
                  disabled
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Alert Preferences */}
            <AlertPreferencesComponent />

            {/* Delete Account */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialog(true)}
                startIcon={<DeleteOutline />}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Delete Account Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => !loading && setOpenDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(10, 25, 41, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'white' }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteOutline />}
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