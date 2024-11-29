import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import PublicIcon from '@mui/icons-material/Public';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

interface AuroraDashboardProps{
  latitude: number,
  longitude: number
}
const AuroraDashboard = ({ latitude, longitude }: AuroraDashboardProps) => {
  const [data, setData] = useState({
    kpIndex: "-",
    bz: "-",
    speed: "-",
    temperature: "-",
    precipitation: "-",
    windSpeed: "-",
    uvIndex: "-"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await fetch(
          "http://localhost:3002/auroraforecast?longitude="+longitude+"&latitude="+latitude
        );
        const result = await response.json();
        setLoading(false);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{
        setLoading(false); 
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return (
    <Card sx={{
      width: '74%',
      margin: 'auto',
      padding: 2,
      bgcolor: 'grey.800',
      color: "white",
      opacity: "0.7",
      
      
    }}>
      <CardContent>
        <Grid container spacing={2} sx={{opacity:'1'}}>
          {/* Kp Index */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <AirIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Kp Index
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.kpIndex}</Typography>
            )}
          </Grid>

          {/* Bz */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <PublicIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Bz
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.bz}</Typography>
            )}
          </Grid>

          {/* Solar Wind Speed */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <AirIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Solar Wind Speed
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.speed + " km/s"}</Typography>
            )}
          </Grid>

          {/* Temperature */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <DeviceThermostatIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Temperature
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.temperature}</Typography>
            )}
          </Grid>

          {/* Precipitation */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <WaterDropIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Precipitation
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.precipitation}</Typography>
            )}
          </Grid>

          {/* Wind Speed */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <AirIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              Wind Speed
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.windSpeed}</Typography>
            )}
          </Grid>

          {/* UV Index */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              <WbSunnyIcon fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
              UV Index
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.uvIndex}</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AuroraDashboard;
