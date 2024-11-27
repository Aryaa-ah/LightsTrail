// src/components/EmptyState.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Camera } from 'lucide-react';

interface EmptyStateProps {
  onUpload: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUpload }) => {
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
      <Camera 
        size={48}
        className="text-gray-400 mb-4"
      />
      <Typography
        variant="h6"
        sx={{ 
          mb: 2,
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        No Photos Yet
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, textAlign: 'center' }}
      >
        Upload your first aurora photo to get started
      </Typography>
      <Button
        variant="contained"
        onClick={onUpload}
        startIcon={<Camera size={20} />}
        sx={{
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        Upload Photo
      </Button>
    </Box>
  );
};

export default EmptyState;