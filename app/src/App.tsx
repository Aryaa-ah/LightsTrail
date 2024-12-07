/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from './components/Footer';
import { Box } from "@mui/material";

import { theme } from './theme/theme';
// Components 
// Import the new theme and routes
import { appTheme } from "./themes/theme";
import { AppRoutes } from "./route/AppRoutes";

// Define Location interface
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

function App() {
  // Location state management
  const [location, setLocation] = React.useState<Location>({
    city_country: "Select Location",
    latitude: 0,
    longitude: 0,
  });
return(
  <div className="min-h-screen bg-background-default">
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <Provider store={store}>
      <Router>
        <AppRoutes 
          location={location} 
          setLocation={setLocation} 
        />
      </Router>




      <Footer />
    </Provider>
  </ThemeProvider>
</div>

);
}


export default App;