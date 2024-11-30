 import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        minHeight: 400,
      }}
    >
      <AlertCircle 
        size={48}
        className="text-red-500 mb-4"
      />
      <Typography
        variant="h6"
        sx={{ 
          mb: 2,
          color: 'error.main',
          textAlign: 'center'
        }}
      >
        Something went wrong
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, textAlign: 'center' }}
      >
        {error}
      </Typography>
      <Button
        variant="contained"
        onClick={onRetry}
        sx={{
          bgcolor: 'error.main',
          '&:hover': {
            bgcolor: 'error.dark',
          },
        }}
      >
        Try Again
      </Button>
    </Box>
  );
};

export default ErrorState;