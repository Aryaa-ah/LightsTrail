import React from 'react';
import { Box, Typography, Button, useMediaQuery, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleGoHome = () => {
    // Navigate to home and ensure it doesn't redirect to login
    navigate('/home', { replace: true });
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: isMobile ? 2 : 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          fontSize: isMobile ? 80 : 120, 
          color: '#84fab0', 
          mb: 2 
        }} 
      />
      
      <Typography 
        variant={isMobile ? 'h4' : 'h2'} 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700, 
          color: 'white',
          mb: 2,
          px: isMobile ? 2 : 0
        }}
      >
        404 - Page Not Found
      </Typography>
      
      <Typography 
        variant={isMobile ? 'body1' : 'h5'} 
        component="p" 
        gutterBottom
        sx={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          mb: 4,
          maxWidth: 500,
          mx: 'auto',
          px: isMobile ? 2 : 0
        }}
      >
        Oops! The page you are looking for seems to have wandered off into the digital wilderness.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={handleGoHome}
        sx={{
          textTransform: 'none',
          px: isMobile ? 3 : 4,
          py: isMobile ? 1 : 1.5,
          borderRadius: 2,
          fontSize: isMobile ? '0.875rem' : '1rem',
          background: 'linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)',
          border: 0,
          boxShadow: '0 3px 5px 2px rgba(132, 250, 176, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #72e6a0 30%, #7bc8f0 90%)',
            transform: 'scale(1.05)',
          }
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;