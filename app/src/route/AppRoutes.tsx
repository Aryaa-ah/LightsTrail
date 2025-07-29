import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import Chat from '../pages/Chat';

// Types
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

// Component to handle static file redirects
const StaticFileRedirect = ({ filename }: { filename: string }) => {
  React.useEffect(() => {
    // Force browser to load the actual file from public folder
    window.location.href = `/${filename}`;
  }, [filename]);
  
  return null; // Don't render anything
};

// Enhanced Protected Route Component - TEMPORARILY DISABLED
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TEMPORARILY DISABLE AUTH - Always allow access
  return <>{children}</>;
  
  // Original auth logic (keep for future use)
  // const location = useLocation();
  // const isAuthenticated = authService.isAuthenticated();
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }
  // return <>{children}</>;
};

// Public Route Component (for login/signup) - TEMPORARILY DISABLED
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // TEMPORARILY DISABLE AUTH - Don't redirect to home
  return <>{children}</>;

  // Original auth logic (keep for future use)
  // const isAuthenticated = authService.isAuthenticated();
  // if (isAuthenticated) {
  //   return <Navigate to="/home" replace />;
  // }
  // return <>{children}</>;
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
      {/* Root redirect - TEMPORARILY redirect to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* STATIC FILE ROUTES - Handle these BEFORE other routes */}
      <Route path="/sitemap.xml" element={<StaticFileRedirect filename="sitemap.xml" />} />
      <Route path="/robots.txt" element={<StaticFileRedirect filename="robots.txt" />} />
      
      {/* Auth routes - Keep accessible but don't enforce redirects */}
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

      {/* All routes now use ProtectedRoute but it allows all access */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <Home latitude={location.latitude} longitude={location.longitude} />
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
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <WebCamPage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <>
              <ResponsiveAppBar location={location} setLocation={setLocation} />
              <Chat />
            </>
          </ProtectedRoute>
        }
      />

      {/* 404 fallback - MUST BE LAST */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};