// src/features/auroraPrediction/pages/AuroraPredictionPage.tsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchViewingSpots, setSelectedSpot } from "../store/AuroraPredSlice";
import AuroraBestLocations from "../components/auroraBestLocations";
import PredictionList from "../components/PredictionList";
import type { ViewingSpot } from "../types/auroraPred.types";
import StarBackground from "../components/StarBackground";
import { debounce } from 'lodash';

const AuroraPredictionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { viewingSpots, selectedSpot, loading, error, lastUpdated } =
    useSelector((state: RootState) => state.auroraPrediction);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const paginatedSpots = useMemo(() => {
    return viewingSpots.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [viewingSpots, page]);

  const debouncedSpotSelect = useCallback(
    debounce((spot) => {
      handleSpotSelect(spot);
    }, 300),
    []
  );

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
        position: 'relative',
        minHeight: "100vh",
        pt: 10,
        pb: 4,
        px: 3,
        bgcolor: "transparent",  
      }}
    >
      <StarBackground starCount={1000} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.4)',
          zIndex: 1,
        }}
      />
      <Container 
        maxWidth="xl"
        sx={{ 
          position: 'relative',
          zIndex: 2 
        }}
      >
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
            <AuroraBestLocations
              spots={paginatedSpots}
              selectedSpot={selectedSpot}
              onSpotSelect={debouncedSpotSelect}
              loading={loading}
            />
          </Box>
          <Box sx={{ flex: { md: "0 0 33.333333%" }, width: "100%" }}>
            <PredictionList
              spots={paginatedSpots}
              selectedSpot={selectedSpot}
              onSpotClick={debouncedSpotSelect}
              loading={loading}
              lastUpdated={lastUpdated}
              page={page}
              onPageChange={setPage}
              totalPages={Math.ceil(viewingSpots.length / ITEMS_PER_PAGE)}
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
