// src/features/auroraPrediction/components/ViewingSpotCard.tsx

import React from "react";
import { Box, Typography, Rating, Chip, useTheme, alpha } from "@mui/material";
import {
  WbSunny,
  Cloud,
  Visibility,
  ThunderstormOutlined,
} from "@mui/icons-material";
import { ViewingSpot } from "../types/auroraPred.types";
import { format } from "date-fns";

interface ViewingSpotCardProps {
  spot: ViewingSpot;
  expanded?: boolean;
}

const ViewingSpotCard: React.FC<ViewingSpotCardProps> = ({
  spot,
  expanded = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: expanded ? 2 : 1,
        borderRadius: 1,
        bgcolor: expanded
          ? alpha(theme.palette.background.paper, 0.9)
          : "transparent",
      }}
    >
      <Typography variant={expanded ? "h6" : "subtitle1"} gutterBottom>
        {spot.location}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
        <Chip
          icon={<ThunderstormOutlined />}
          label={`Kp ${spot.kpIndex}`}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            color: "primary.main",
          }}
        />
        <Chip
          icon={<Cloud />}
          label={`${spot.cloudCover}%`}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.2),
            color: "secondary.main",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WbSunny fontSize="small" color="primary" />
          <Typography variant="body2">
            Probability: {spot.probability}%
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Visibility fontSize="small" color="primary" />
          <Typography variant="body2">
            Visibility: {spot.visibility}%
          </Typography>
        </Box>

        {expanded && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Cloud fontSize="small" color="primary" />
              <Typography variant="body2">
                Temperature: {spot.temperature}°C
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Last updated:{" "}
              {format(new Date(spot.updatedAt), "MMM dd, yyyy HH:mm")}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ mt: 1 }}>
        <Rating value={spot.rating} readOnly size="small" precision={0.5} />
      </Box>
    </Box>
  );
};

export default ViewingSpotCard;
