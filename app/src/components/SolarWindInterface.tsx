import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Container } from '@mui/material';
import { Clock, Sun, Calendar } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { blue } from '@mui/material/colors';

const SolarWindInterface = () => {
  const [activeTab, setActiveTab] = useState('2Hour');
  const [activeTabURL, setActiveTabURL] = useState('https://services.swpc.noaa.gov/images/ace-mag-swepam-2-hour.gif');
  const tabs = [
    { id: '2Hour', label: '2 Hour', icon: <Clock className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/ace-mag-swepam-2-hour.gif" },
    { id: '6Hour', label: '6 Hour', icon: <Clock className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/ace-mag-swepam-6-hour.gif" },
    { id: '24Hour', label: '24 Hour', icon: <Clock className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/ace-mag-swepam-24-hour.gif" },
    { id: '3Day', label: '3 Day', icon: <Calendar className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/ace-mag-swepam-3-day.gif" },
    { id: '7Day', label: '7 Day', icon: <Calendar className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/ace-mag-swepam-7-day.gif" }
  ];
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '20px',
        opacity: '0.7'
        
      }}
    >
      <Container 
        sx={{ 
          width: '80%', 
          height: '80%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Card sx={{ bgcolor: 'grey.800', borderColor: 'grey.700', width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Sun style={{ width: 24, height: 24, color: 'white' }} />
              <Typography 
                variant="h4" 
                component="h1"
                sx={{
                  background: 'linear-gradient(to right, #60A5FA, #22D3EE)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                ACE Real-Time Solar Wind Data
              </Typography>
            </Box>

            {/* Time Range Tabs */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'contained' : 'outlined'}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveTabURL(tab.src);
                  }}
                  startIcon={tab.icon}
                  sx={{
                    bgcolor: activeTab === tab.id ? 'primary.main' : 'grey.700',
                    color: activeTab === tab.id ? 'white' : 'grey.300',
                    '&:hover': {
                      bgcolor: activeTab === tab.id ? 'primary.dark' : 'grey.600',
                    },
                    boxShadow: activeTab === tab.id ? 4 : 0,
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>

            {/* Graph Container */}
            <Box 
              sx={{ 
                bgcolor: 'black', 
                borderRadius: 1, 
                p: 2, 
                border: 1, 
                borderColor: 'grey.700', 
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              
              <img 
                src={activeTabURL} 
                alt="ACE Solar Wind Data Graph" 
                style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }} 
                onClick={handleClickOpen}
              />
             
              
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={open} onClose={handleClose}>
          <DialogTitle>ACE Real-Time Solar Wind Data</DialogTitle>
      <DialogContent>
      <Typography gutterBottom>
            The data on this graph comes from NASA’s Advanced Composition Explorer (ACE) Satellite. ACE is positioned at the L1 Lagrange Point about 1.5 million km from Earth in the direction of the sun. The satellite samples and measures the solar wind up to 1 hour before it reaches Earth.
          </Typography>
          <Typography gutterBottom>
            Note: Since July of 2016 ACE is no longer the primary source for solar wind data. The new satellite DSCOVR (data shown below) is generally more reliable. The data from ACE frequently blacks out for a number of hours.
          </Typography>
          <Typography variant="h6" gutterBottom>
            There are 5 different measurements shown on this graph:
          </Typography>
          <Typography gutterBottom>
            <strong style={{color:'red'}}>Bt/Bz (white/red lines)</strong> – Bt indicates the total strength of the Interplanetary Magnetic Field (IMF) carried by the solar wind. A higher number indicates a stronger impact to earth’s magnetic field. Bz indicates the orientation of the IMF. If the Bz is positive (northward), then the earth’s magnetic field will block most of the solar wind, and geomagnetic storming is unlikely. But if Bz is negative (southward), then the sun and the earth’s magnetic field will link up, which allows the solar wind to pour into the earth’s atmosphere, causing the aurora. The further southward the Bz points and the longer the duration, the higher the chance is of a geomagnetic storm occurring.
          </Typography>
          <Typography gutterBottom>
            <strong style={{color:'blue'}}>Phi (blue line)</strong> – Phi is the angle of the IMF measured in the GSM (geocentric solar magnetospheric) coordinate system. Sudden and rapid changes in the Phi angle in conjunction with increased solar wind speeds and Bz fluctuations is common during a CME impact.
          </Typography>
          <Typography gutterBottom>
            <strong style={{color:'orange'}}>Density (orange line)</strong> – The solar wind carries with it plasma (electrons and protons). This is measured in atoms per cubic centimeter. A high and fluctuating plasma density is usually better at stirring up the aurora.
          </Typography>
          <Typography gutterBottom>
            <strong style={{color:'yellow'}}>Speed (yellow line)</strong> – Measured in kilometers per second, the speed of the solar wind can vary from 250 – 800+ km/s. A faster solar wind is usually associated with elevated geomagnetic activity.
          </Typography>
          <Typography gutterBottom>
            <strong style={{color:'green'}}>Temp (green line)</strong> – The temperature of the solar wind is measured in Kelvin units. A rise in temperature is likely during an impact to earth’s magnetic field.
          </Typography>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
                  Close
          </Button>
        </DialogActions>
        </Dialog>
    </Box>
  );
};

export default SolarWindInterface;
