import React from 'react';
import { Box, Typography, Button, useMediaQuery, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
      }}
    >
      <ErrorOutlineIcon 
        sx={{ 
          fontSize: isMobile ? 80 : 120, 
          color: 'primary.main', 
          mb: 2 
        }} 
      />
      
      <Typography 
        variant={isMobile ? 'h4' : 'h2'} 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
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
          color: 'text.secondary', 
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
        onClick={() => navigate('/home')}
        sx={{
          textTransform: 'none',
          px: isMobile ? 3 : 4,
          py: isMobile ? 1 : 1.5,
          borderRadius: 2,
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;