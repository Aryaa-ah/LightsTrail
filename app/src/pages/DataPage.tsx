import AuroraDashboard from '../components/AuroraDashboard.tsx'
import SolarWindInterface from '../components/SolarWindInterface.jsx'
import NorthernHemisphere from '../components/Northern.tsx'
import SouthernHemisphere from '../components/Southern.tsx'
import KpIndexInterface from '../components/KpIndexInterface.tsx'
import { Box } from '@mui/material'
import React from 'react'


const Data = () => {
  return (
    <div style={{ paddingTop: '74px' }}>
      {/* Wrapper Box for dashboard content */}
      <Box 
        sx={{
          position: 'relative',
          zIndex: 1, // Ensure content is above StarBackground
        }}
      >
        
        <SolarWindInterface/>
        <KpIndexInterface/>
        <NorthernHemisphere/>
        <SouthernHemisphere/>
      </Box>
    </div>
  );
};

export default Data;