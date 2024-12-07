import React from "react";
import { Box, useTheme, alpha, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { styled } from "@mui/material/styles";
import { ViewingSpot } from "../types/auroraPred.types";

const MapWrapper = styled(Box)(() => ({
  "& .leaflet-container": {
    width: "100%",
    height: "100%",
    backgroundColor: "#242424",
  },
  "& .leaflet-popup-content-wrapper": {
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    color: "white",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
  },
  "& .leaflet-popup-tip": {
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  "& .leaflet-control-zoom": {
    border: "none",
  },
  "& .leaflet-control-zoom a": {
    backgroundColor: "rgba(30, 30, 30, 0.95) !important",
    color: "white !important",
    border: "1px solid rgba(255, 255, 255, 0.1) !important",
    backdropFilter: "blur(8px)",
  },
  "& .leaflet-control-zoom a:hover": {
    backgroundColor: "rgba(50, 50, 50, 0.95) !important",
  },
  "& .leaflet-control-attribution": {
    backgroundColor: "rgba(30, 30, 30, 0.8) !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    backdropFilter: "blur(8px)",
  },
  "& .leaflet-control-attribution a": {
    color: "rgba(255, 255, 255, 0.9) !important",
  },
  "& .aurora-marker": {
    animation: "pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.2)",
      opacity: 0.7,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
}));

interface AuroraMapProps {
  spots: ViewingSpot[];
  selectedSpot: ViewingSpot | null;
  onSpotSelect: (spot: ViewingSpot) => void;
}

const AuroraMap: React.FC<AuroraMapProps> = ({
  spots,
  selectedSpot,
  onSpotSelect,
}) => {
  const theme = useTheme();
  const mapCenter: [number, number] = [65, -150];

  const getSpotColor = (spot: ViewingSpot) => {
    if (spot.probability >= 80) return theme.palette.success.main;
    if (spot.probability >= 60) return theme.palette.info.main;
    if (spot.probability >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <MapWrapper
      sx={{
        height: "70vh",
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {spots.filter(spot => spot.probability > 0).map((spot) => (
          <React.Fragment key={spot.id}>
            <Circle
              center={spot.coordinates}
              radius={100000}
              pathOptions={{
                color: getSpotColor(spot),
                fillColor: getSpotColor(spot),
                fillOpacity: selectedSpot?.id === spot.id ? 0.4 : 0.2,
              }}
            />
            <Marker
              position={spot.coordinates}
              eventHandlers={{
                click: () => onSpotSelect(spot),
              }}
            >
              <Popup>
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle1">{spot.location || 'Aurora Viewing Spot'}</Typography>
                  <Typography variant="body2">
                    Probability: {Math.round(spot.probability)}%
                  </Typography>
                  {spot.visibility && (
                    <Typography variant="body2">
                      Visibility: {spot.visibility}%
                    </Typography>
                  )}
                  {spot.temperature && (
                    <Typography variant="body2">
                      Temperature: {spot.temperature}°C
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default AuroraMap;