import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Container } from '@mui/material';
import { Clock, Sun, Calendar } from 'lucide-react';

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
                style={{ maxWidth: '100%', height: 'auto' }} 
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SolarWindInterface;
