import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle popup message
        if (window.opener) {
          // This is a popup window
          const data = location.search;
          window.opener.postMessage({ type: 'AUTH_SUCCESS', data }, window.location.origin);
          window.close();
          return;
        }

        // Handle direct navigation
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userStr = params.get('user');

        if (!token || !userStr) {
          throw new Error('Invalid authentication response');
        }

        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Navigate to home
        navigate('/home', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { 
          replace: true,
          state: { error: 'Authentication failed' }
        });
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
    }}>
      <CircularProgress />
    </Box>
  );
}