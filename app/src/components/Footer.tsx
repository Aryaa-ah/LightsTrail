import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, alpha } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Email } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'transparent',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" 
              sx={{ 
                background: 'linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2 
              }}>
              About Lights Trail
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal aurora forecasting companion. Track, predict, and never miss the Northern Lights with community sharing.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" 
              sx={{ 
               background: 'linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2 
              }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/gallery" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Gallery
              </Link>
              <Link href="/glossary" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Glossary
              </Link>
              <Link href="/data" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Data
              </Link>
            </Box>
          </Grid>

          {/* Contact/Social */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" 
              sx={{ 
                background: 'linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2 
              }}>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton 
                href="https://github.com" 
                target="_blank"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton 
                href="https://linkedin.com" 
                target="_blank"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton 
                href="https://twitter.com" 
                target="_blank"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                href="mailto:contact@lightstrail.com"
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4, pt: 2, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}
        >
          © {currentYear} Lights Trail. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;