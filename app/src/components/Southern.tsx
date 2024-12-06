import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Button, Typography, LinearProgress } from '@mui/material';

// Define the shape of each image object
interface ImageData {
  url: string;
}

const SouthernHemisphere = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('https://services.swpc.noaa.gov/products/animations/ovation_south_24h.json');
      const data = await response.json();
      setImages(data);
      setIsLoaded(true);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, images.length]);

  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = `https://services.swpc.noaa.gov${images[currentIndex].url}`;
        img.onload = () => {
          canvas.width = 500; // Fixed size for consistency
          canvas.height = 500; // Adjust height as needed
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Resize image
        };
      } else {
        console.error('Failed to get canvas context.');
      }
    }
  }, [currentIndex, images, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setProgressBarValue((currentIndex / (images.length - 1)) * 100);
    }
  }, [currentIndex, images.length, isLoaded]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  if (!isLoaded) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px',
        opacity: '0.7'
      }}
    >
      <Card sx={{ bgcolor: 'grey.800', borderColor: 'grey.700', width: '77%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: 'linear-gradient(to right, #60A5FA, #22D3EE)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Southern Hemisphere
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                margin: '0 auto',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressBarValue}
            sx={{
              bgcolor: 'grey.700',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
              mb: 3,
              height: '10px',
              borderRadius: 2,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
              onClick={handlePlayPause}
              variant="contained"
              sx={{
                bgcolor: isPlaying ? 'error.main' : 'primary.main',
                '&:hover': {
                  bgcolor: isPlaying ? 'error.dark' : 'primary.dark',
                },
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SouthernHemisphere;
