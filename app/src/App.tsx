import "./App.css";
import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from './components/Footer';
import { Box } from "@mui/material";
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { appTheme } from "./themes/theme";
import { AppRoutes } from "./route/AppRoutes";

// Define Location interface
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

// Create a wrapper component to handle the conditional footer rendering
const AppContent: React.FC<{ location: Location; setLocation: (location: Location) => void }> = ({ 
  location, 
  setLocation 
}) => {
  const { pathname } = useLocation();
  
  // Define routes where footer should not appear
  const routesWithoutFooter = ['/auth/login', '/auth/signup'];
  const shouldShowFooter = !routesWithoutFooter.includes(pathname);

  return (
    <>
      <AppRoutes location={location} setLocation={setLocation} />
      <PWAInstallPrompt />
      {shouldShowFooter && <Footer />}
    </>
  );
};

function App() {
  const [location, setLocation] = React.useState<Location>({
    city_country: "Select Location",
    latitude: 0,
    longitude: 0,
  });

  return (
    <div className="min-h-screen bg-background-default">
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Provider store={store}>
          <Router>
            <AppContent location={location} setLocation={setLocation} />
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;