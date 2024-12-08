import React from 'react';
import { Card, CardContent, Grid, Typography, Box, useTheme, } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface WebCam {
  name: string;
  country: string;
  location: string;
  youtubeLink: string;
}

declare var window: any;

const WebCamPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const tableList: WebCam[] = [
    {
      name: 'Lyngen North Aurora Cam',
      country: 'Norway',
      location: 'Rotsund',
      youtubeLink: 'https://www.youtube.com/live/SY6DOBZ2hPk?si=0Pfi1txt2DtKKdcW',
    },
    {
      name: 'Aurora Borealis (LIVE!)',
      country: 'Finland',
      location: 'Utsjoki',
      youtubeLink: 'https://www.youtube.com/live/dvNb31_0D68?si=-ziY3Mz1baUKT6Ia',
    },
    {
      name: 'Fairbanks Aurora Camera',
      country: 'United States',
      location: 'Fairbanks, AK',
      youtubeLink: 'https://www.youtube.com/live/O52zDyxg5QI?si=dntH2-y29Bwq8yP_',
    },
    {
      name: 'Northern Studies Center',
      country: 'Canada',
      location: 'Churchill, MB',
      youtubeLink: 'https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA',
    },
    {
      name: 'Queenstown Roundshot',
      country: 'New Zealand',
      location: 'Queenstown',
      youtubeLink: 'https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA',
    },
    {
      name: 'Kjell Henriksen Observatory',
      country: 'Norway',
      location: 'Longyearbyen, Svalbard',
      youtubeLink: 'https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA',
    },
    {
      name: 'Northern Studies Center',
      country: 'Canada',
      location: 'Churchill, MB',
      youtubeLink: 'https://www.youtube.com/live/a0i1Kg6fROg?si=mOS0SugFla1htMnA',
    },
  ];

  const handleClick = (link: string): void => {
    window.open(link, '_blank');
  };

  return (
    <Box sx={{ marginTop: '100px', padding: '20px',  minHeight: '100vh' }}>
      
        <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                margineTop: '180px',
                marginBottom: '50px',
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)"
                    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
                {t('webCam.title') || 'Webcams'}
            </Typography>
 
      <Grid container spacing={4}>
        {tableList.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                cursor: 'pointer',
                backgroundColor: '#1e1e2f',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.8)',
                },
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onClick={() => handleClick(item.youtubeLink)}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: '#76c7c0', textAlign: 'center' }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}
                >
                  <strong>Country:</strong> {item.country}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: '#b0b0b0', textAlign: 'center' }}>
                  <strong>Location:</strong> {item.location}
                </Typography>
                <Box
                  sx={{
                    textAlign: 'center',
                    marginTop: '20px',
                    color: '#9d9d9d',
                    fontStyle: 'italic',
                  }}
                >
                  Click to view the live stream
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WebCamPage;
