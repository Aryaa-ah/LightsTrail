import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import PublicIcon from '@mui/icons-material/Public';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import InfoIcon from '@mui/icons-material/Info';
import AuroraPopup from './AuroraInfoPopup';
import {
  Whatshot,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

import { RootState, AppDispatch } from '../store/index';
import { fetchAuroraData } from '../store/AuroraDashboardSlice';

import { Box } from '@mui/material';

interface AuroraDashboardProps {
  latitude: number;
  longitude: number;
}

const AuroraDashboard = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.auroraDashboard);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleIconClick = () => {
    setIsPopupVisible(true);
  };

  // useEffect(() => {
  //   dispatch(fetchAuroraData({ latitude, longitude }));
  // }, [dispatch, latitude, longitude]);

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{t('dashboard.error', { error })}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: "74%",
        margin: "auto",
        padding: 2,
        bgcolor: "grey.800",
        color: "white",
        opacity: "0.7",
      }}
    >
      <CardContent>
        <Grid container spacing={2} sx={{ opacity: "1" }}>
          {/* Kp Index */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <AirIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.kpIndex")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.kpIndex}</Typography>
            )}
          </Grid>

          {/* Bz */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <PublicIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.magneticField")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.bz}</Typography>
            )}
          </Grid>

          {/* Solar Wind Speed */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <AirIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.solarWind")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.speed + " km/s"}</Typography>
            )}
          </Grid>

          {/* Temperature */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <DeviceThermostatIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.temperature")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.temperature}</Typography>
            )}
          </Grid>

          {/* Precipitation */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <WaterDropIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.precipitation")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.precipitation}</Typography>
            )}
          </Grid>

          {/* Wind Speed */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <AirIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t('dashboard.windSpeed')}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.windSpeed}</Typography>
            )}
          </Grid>

          {/* UV Index */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              <WbSunnyIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", marginRight: 1 }}
              />
              {t("dashboard.uvIndex")}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Typography variant="body1">{data.uvIndex}</Typography>
            )}
          </Grid>

          {/* Probablity */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            >
              {t("dashboard.probability")}
              <InfoIcon
                fontSize="small"
                onClick={handleIconClick}
                sx={{ verticalAlign: "middle", marginLeft: 1, cursor: "pointer" }}
              />
               {isPopupVisible && <AuroraPopup closePopup={() => setIsPopupVisible(false)} />}
            </Typography>
            {loading ? (
              <Skeleton width="20%" />
            ) : (
              <Box display="flex" alignItems="center">
                {parseInt(data.probability) > 70 ? (
                  <Whatshot
                    sx={{
                      color:
                        parseInt(data.probability) > 90
                          ? 'error.main'
                          : 'warning.main',
                      marginRight: 1
                    }}
                  />
                ) : parseInt(data.probability) > 50 ? (
                  <TrendingUp
                    sx={{
                      color: 'success.main',
                      marginRight: 1
                    }}
                  />
                ) : (
                  <TrendingDown
                    sx={{
                      color:
                        parseInt(data.probability) < 30
                          ? 'error.main'
                          : 'warning.main',
                      marginRight: 1
                    }}
                  />
                )}

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color:
                      parseInt(data.probability) > 90
                        ? 'error.main'
                        : parseInt(data.probability) > 70
                          ? 'warning.main'
                          : parseInt(data.probability) > 50
                            ? 'success.main'
                            : 'text.secondary'
                  }}
                >
                  {data.probability} 
                  
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AuroraDashboard;