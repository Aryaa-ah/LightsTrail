import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth";

// Components
import ResponsiveAppBar from "../components/Navbar";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import GoogleAuthCallback from "../components/GoogleAuthCallback";

// Pages
import Home from "../pages/Home";
import GalleryPage from "../pages/GalleryPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import Glossary from "../pages/glossary";
import Data from "../pages/DataPage";
import AuroraPredictionPage from "../pages/auroraPredPage";
import WebCamPage from "../pages/WebCamPage";
import AuroraPredictionService from "../pages/TourismGuide";

// Types
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

// Enhanced Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login and save the intended path
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (for login/signup)
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

// Main Routes Component
export const AppRoutes = ({
  location,
  setLocation,
}: {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      <Route path="/auth/success" element={<GoogleAuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <Home
                latitude={location.latitude}
                longitude={location.longitude}
              />
            </>
          </ProtectedRoute>
        }
      />

<Route
        path="/Tourism-Guide"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <AuroraPredictionService />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
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
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <GalleryPage userOnly={true} />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <ProfilePage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/glossary"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <Glossary />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/best-Locations"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <AuroraPredictionPage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/live-data"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <Data />
            </>
          </ProtectedRoute>
        }
      />
       
        <Route
        path="/webcam"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar
                location={location}
                setLocation={setLocation}
              />
              <WebCamPage/>
            </>
          </ProtectedRoute>
        }
      />

      {/* Root and Fallback Routes */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
