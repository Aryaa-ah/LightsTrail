// App.tsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import ResponsiveAppBar from './components/Navbar';
// import Layout from "./components/Layout";

// Pages
import Home from './pages/Home';
import GalleryPage from "./pages/GalleryPage";
import UserGallery from "./pages/UserGallery";

// Define the Location interface
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

// Create theme configuration
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  // Location state management
  const [location, setLocation] = React.useState<Location>({
    city_country: 'Select Location',
    latitude: 0,
    longitude: 0,
  });

  return (
    <div className="min-h-screen bg-background-default">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Router>
            {/* Pass location props to Navbar */}
            <ResponsiveAppBar location={location} setLocation={setLocation} />
            
              <Routes>
                {/* Home route with location props */}
                <Route path="/" element={
                  <Home latitude={location.latitude} longitude={location.longitude} />
                } />
                <Route path="/gallery" element={<GalleryPage userOnly={false} />} />
                <Route path="/my-gallery" element={<UserGallery userOnly={true} />} />
              </Routes>
            
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;