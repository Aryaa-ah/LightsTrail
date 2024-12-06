// src/features/auroraPrediction/pages/AuroraPredictionPage.tsx

import React, { useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchViewingSpots, setSelectedSpot } from "../store/AuroraPredSlice";
import AuroraMap from "../components/AuroraMap";
import PredictionList from "../components/PredictionList";
import type { ViewingSpot } from "../types/auroraPred.types";

const AuroraPredictionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewingSpots, selectedSpot, loading, error, lastUpdated } =
    useSelector((state: RootState) => state.auroraPrediction);

  useEffect(() => {
    dispatch(fetchViewingSpots());

    const interval = setInterval(() => {
      dispatch(fetchViewingSpots());
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleSpotSelect = (spot: ViewingSpot) => {
    dispatch(setSelectedSpot(spot));
  };

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "error.main",
        }}
      >
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10,
        pb: 4,
        px: 3,
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            background: "linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Aurora Viewing Spots
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: { md: "0 0 66.666667%" }, width: "100%" }}>
            <AuroraMap
              spots={viewingSpots}
              selectedSpot={selectedSpot}
              onSpotSelect={handleSpotSelect}
            />
          </Box>
          <Box sx={{ flex: { md: "0 0 33.333333%" }, width: "100%" }}>
            <PredictionList
              spots={viewingSpots}
              selectedSpot={selectedSpot}
              onSpotClick={handleSpotSelect}
              loading={loading}
              lastUpdated={lastUpdated}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 1,
            bgcolor: "rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Data is updated every 5 minutes. Predictions are based on real-time
            NOAA data, including Kp index, cloud cover, and local conditions.
            Higher probability indicates better viewing conditions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuroraPredictionPage;
