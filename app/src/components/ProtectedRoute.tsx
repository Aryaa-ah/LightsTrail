// import { Navigate } from "react-router-dom";
// import { authService } from "../services/auth";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const isAuthenticated = authService.isAuthenticated();
//   const isDevelopment = process.env.NODE_ENV === "development";

//   // In development mode, allow access to all routes
//   if (isDevelopment) {
//     return <>{children}</>;
//   }

//   // In production, check authentication
//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   return <>{children}</>;
// }


import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login while saving attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}