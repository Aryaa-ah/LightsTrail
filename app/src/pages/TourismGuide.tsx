import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions,
  Paper,
  Box
} from '@mui/material';
import { 
  LocationOn as LocationOnIcon, 
  PhotoCamera as PhotoCameraIcon, 
  AcUnit as SnowflakeIcon,
  WbSunny as SunIcon,
  DateRange as CalendarIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Destination Data
const destinations = [
  {
    name: "Iceland",
    probability: 80,
    bestMonths: "Sep-Mar",
    avgTemp: -2,
    description: "Land of fire and ice, perfect for aurora hunting",
    icon: <SnowflakeIcon color="primary" sx={{ fontSize: 50 }} />
  },
  {
    name: "Norway",
    probability: 75,
    bestMonths: "Oct-Mar",
    avgTemp: -4,
    description: "Arctic Circle magic with stunning fjord landscapes",
    icon: <SnowflakeIcon color="primary" sx={{ fontSize: 50 }} />
  },
  {
    name: "Finland",
    probability: 70,
    bestMonths: "Aug-Apr",
    avgTemp: -5,
    description: "Lapland's winter wonderland with glass igloos",
    icon: <SnowflakeIcon color="primary" sx={{ fontSize: 50 }} />
  }
];

// Aurora Probability Chart Data
const auroraData = [
  { month: 'Jan', probability: 65 },
  { month: 'Feb', probability: 70 },
  { month: 'Mar', probability: 75 },
  { month: 'Apr', probability: 50 },
  { month: 'Sep', probability: 60 },
  { month: 'Oct', probability: 80 },
  { month: 'Nov', probability: 85 },
  { month: 'Dec', probability: 90 }
];

const AuroraTourismGuide = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    destination: '',
    date: ''
  });

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    // Placeholder for booking submission logic
    alert('Booking submitted! We will contact you soon.');
    setBookingOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" color="primary" gutterBottom>
          Aurora Chaser's Ultimate Guide
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Your comprehensive resource for experiencing the magical Northern Lights
        </Typography>
      </Box>

      {/* Destinations Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {destinations.map((dest) => (
          <Grid item xs={12} md={4} key={dest.name}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {dest.icon}
                  <Typography variant="h5" sx={{ ml: 2 }}>
                    {dest.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {dest.description}
                </Typography>
                <Typography variant="body1">
                  🌟 Aurora Probability: {dest.probability}%
                </Typography>
                <Typography variant="body1">
                  📅 Best Months: {dest.bestMonths}
                </Typography>
                <Typography variant="body1">
                  🌡️ Avg. Temperature: {dest.avgTemp}°C
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setBookingDetails(prev => ({...prev, destination: dest.name}));
                    setBookingOpen(true);
                  }}
                >
                  Book Trip
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Aurora Probability Chart */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Aurora Viewing Probability by Month
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={auroraData}>
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="probability" stroke="#3f51b5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Your Aurora Adventure</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitBooking}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleBookingChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={bookingDetails.email}
                  onChange={handleBookingChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destination"
                  name="destination"
                  value={bookingDetails.destination}
                  onChange={handleBookingChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferred Travel Date"
                  name="date"
                  type="date"
                  value={bookingDetails.date}
                  onChange={handleBookingChange}
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={() => setBookingOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Submit Booking
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Tips Section */}
      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'primary.light' }}>
        <Typography variant="h5" gutterBottom>
          Quick Aurora Chasing Tips
        </Typography>
        <Grid container spacing={2}>
          {[ 
            { 
              icon: <PhotoCameraIcon color="success" />, 
              tip: "Use manual camera settings" 
            },
            { 
              icon: <SunIcon color="warning" />, 
              tip: "Check solar activity forecasts" 
            },
            { 
              icon: <LocationOnIcon color="error" />, 
              tip: "Choose dark sky locations" 
            }
          ].map((item, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box display="flex" alignItems="center">
                {item.icon}
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {item.tip}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default AuroraTourismGuide;
