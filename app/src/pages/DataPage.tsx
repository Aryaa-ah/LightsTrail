import AuroraDashboard from '../components/AuroraDashboard.tsx'
import SolarWindInterface from '../components/SolarWindInterface.jsx'
import NorthernHemisphere from '../components/Northern.tsx'
import SouthernHemisphere from '../components/Southern.tsx'
import KpIndexInterface from '../components/KpIndexInterface.tsx'
import { Box } from '@mui/material'
import React from 'react'
import { useTheme, Typography } from '@mui/material';


const Data = () => {
  const theme = useTheme();
  return (
    <>
   
    <div style={{ paddingTop: '74px' }}>
    
      {/* Wrapper Box for dashboard content */}
      <Box 
        sx={{
          position: 'relative',
          zIndex: 1, // Ensure content is above StarBackground
        }}
      >
        <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                paddingTop: '80px',
              
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)"
                    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: 'flex', 
                paddingLeft: '10%',
                mb: 2,
              }}
            >
               Scientific Data
            </Typography>
        <SolarWindInterface/>
        <KpIndexInterface/>
        <NorthernHemisphere/>
        <SouthernHemisphere/>
      </Box>
    </div>
    </>
  );
};

export default Data;