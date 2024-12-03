// App.tsx
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { authService } from "./services/auth";

// Components
import ResponsiveAppBar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleAuthCallback from "./components/GoogleAuthCallback";

// Pages
import Home from "./pages/Home";
import GalleryPage from "./pages/GalleryPage";
import UserGallery from "./pages/UserGallery";
import ProfilePage from "./pages/ProfilePage";

// Define interfaces
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    return <>{children}</>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

// Create theme configuration (merged both themes)
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196F3",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  // Location state management
  const [location, setLocation] = React.useState<Location>({
    city_country: "Select Location",
    latitude: 0,
    longitude: 0,
  });

  return (
    <div className="min-h-screen bg-background-default">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/auth/google/callback"
                element={<GoogleAuthCallback />}
              />
              <Route path="/auth/success" element={<GoogleAuthCallback />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <>
                      <ResponsiveAppBar
                        location={location}
                        setLocation={setLocation}
                      />
                      <Home
                        latitude={location.latitude}
                        longitude={location.longitude}
                      />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <>
                      <ResponsiveAppBar
                        location={location}
                        setLocation={setLocation}
                      />
                      <GalleryPage userOnly={false} />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-gallery"
                element={
                  <ProtectedRoute>
                    <>
                      <ResponsiveAppBar
                        location={location}
                        setLocation={setLocation}
                      />
                      <UserGallery userOnly={true} />
                    </>
                  </ProtectedRoute>
                }
              />
              // In App.tsx, add this route with your other routes:
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <>
                      <ResponsiveAppBar
                        location={location}
                        setLocation={setLocation}
                      />
                      <ProfilePage />
                    </>
                  </ProtectedRoute>
                }
              />
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
