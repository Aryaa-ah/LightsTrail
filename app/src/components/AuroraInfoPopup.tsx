import React from 'react';
import { Box, Typography, Modal, IconButton, useMediaQuery, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Close icon


interface AuroraPopupProps {
    closePopup: () => void; // 'closePopup' is a function that takes no arguments and returns nothing
  }
const AuroraPopup: React.FC<AuroraPopupProps> = ({ closePopup }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  
  return (
    <Modal open={true} onClose={closePopup}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 2,
          backdropFilter: "blur(10px)",
        }}
      >
        <Paper
          sx={{
            backgroundColor: "grey.900",
            color: "white",
            padding: 3,
            borderRadius: "12px",
            width: isMobile ? "90%" : "60%",
            maxHeight: "80%",
            overflowY: "auto",
            boxShadow: 10,
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <IconButton onClick={closePopup} sx={{ color: "white", fontSize: "24px" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h5" component="h2" sx={{ marginBottom: 3, fontWeight: "bold", fontSize: "1.5rem" }}>
            How We Calculate Aurora Probability
          </Typography>

          <Typography variant="body1" component="p" sx={{ lineHeight: "1.8", fontSize: "1rem", letterSpacing: "0.5px" }}>
            We use several natural and environmental factors to estimate the likelihood of seeing an aurora:
          </Typography>

          <Box sx={{ marginTop: 2 }}>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Geomagnetic Activity (KP Index):</b> Stronger activity increases the chances.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Magnetic Field Orientation (Bz):</b> Certain orientations make auroras more likely.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Solar Wind Speed:</b> Faster winds improve aurora conditions.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Temperature:</b> Cold nights help with visibility.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Precipitation:</b> Less rain or snow improves chances.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Wind Speed:</b> Moderate winds support clear skies.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>UV Index:</b> Higher solar activity increases chances.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Cloud Cover:</b> Fewer clouds mean better visibility.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  <b>Time of Day:</b> Auroras are visible only at night.
                </Typography>
              </li>
            </ul>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default AuroraPopup;
