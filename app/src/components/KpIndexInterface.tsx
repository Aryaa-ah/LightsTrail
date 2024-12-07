import { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Container } from '@mui/material';
import { Calendar } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const KpIndexInterface = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('2Hour');
  const [activeTabURL, setActiveTabURL] = useState('https://services.swpc.noaa.gov/images/swx-overview-large.gif');
  
  const tabs = [
    { id: '3Day', label: t("kpIndex.Day3"), icon: <Calendar className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/swx-overview-large.gif" },
    { id: '7Day', label: t("kpIndex.Day7"), icon: <Calendar className="w-4 h-4" />, src: "https://services.swpc.noaa.gov/images/station-k-index.png" }
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
        opacity: '0.7',
      }}
    >
      <Container
        sx={{
          width: '80%',
          height: '80%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ bgcolor: 'grey.800', borderColor: 'grey.700', width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
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
                {t("kpIndex.title")}
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
                justifyContent: 'center',
              }}
            >
              <img
                src={activeTabURL}
                alt="KP Index Data Graph"
                style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
                onClick={handleClickOpen}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("kpIndex.title")}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {t("kpIndex.description1")}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {t("kpIndex.Day7")}
          </Typography>
          <Typography gutterBottom>
            {t("kpIndex.description2")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("kpIndex.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KpIndexInterface;
