import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Button, Typography, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';

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
  const [open, setOpen] = useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            <Tooltip title="Click to see image details">
              <canvas
                ref={canvasRef}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={handleClickOpen}
              />
            </Tooltip>
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

      {/* Dialog for Image Details */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>OVATION Aurora Forecast Model</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            The OVATION Aurora Forecast Model shows the intensity and location of the aurora predicted for the time shown at the top of the map. This probability forecast is based on current solar wind conditions measured at L1, but using a fixed 30-minute delay time between L1 and Earth. A 30-minute delay corresponds to approximately 800 km/s solar wind speed as might be encountered during geomagnetic storming conditions. In reality, delay times vary from less than 30 minutes to an hour or so for average solar wind conditions.
          </Typography>
          <Typography gutterBottom>
            The sunlit side of Earth is indicated by the lighter blue of the ocean and the lighter color of the continents. The day-night line, or terminator, is shown as a region that goes from light to dark. The lighter edge is where the sun is just at the horizon. The darker edge is where the sun is 12 degrees below the horizon. Note that the aurora will not be visible during daylight hours; however, the aurora can often be observed within an hour before sunrise or after sunset.
          </Typography>
          <Typography gutterBottom>
            Data updates every 5 minutes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SouthernHemisphere;