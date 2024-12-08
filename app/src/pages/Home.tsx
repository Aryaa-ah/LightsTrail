import AuroraDashboard from '../components/AuroraDashboard.tsx'
import { Box } from '@mui/material'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapboxMap from '../components/MapComponent.tsx';
import {AuroraData} from '../types/auroraDashboard.ts';

import { RootState, AppDispatch } from '../store/index';
import { fetchAuroraData } from '../store/AuroraDashboardSlice';
import AuroraMap from '../components/latestData';
import MapWithAurora from '../components/AuroraMap.tsx';
interface HomeProps{
    latitude: number,
    longitude: number
}

const Home = ({ latitude, longitude }: HomeProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.auroraDashboard);
  useEffect(() => {
    dispatch(fetchAuroraData({ latitude, longitude }));
  }, [dispatch, latitude, longitude]);

  return (
    <div style={{ paddingTop: '160px' }}>
      {/* Wrapper Box for dashboard content */}
      <Box 
        sx={{
          position: 'relative',
          zIndex: 1, // Ensure content is above StarBackground
        }}
      >
        <AuroraDashboard/>
        {/* <SolarWindInterface/>
        <KpIndexInterface/>
        
        <NorthernHemisphere/>
        <SouthernHemisphere/> */
        
        <div>
      
      
      {/* <MapboxMap data={data } latitude={latitude} longitude={longitude} /> */}
      {/* <AuroraMap/> */}
      <MapWithAurora data={data } latitude={latitude} longitude={longitude}/>
    </div>
        }
      </Box>
    </div>
  );
};

export default Home;