import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const isDevelopment = process.env.NODE_ENV === "development";

  // In development mode, allow access to all routes
  if (isDevelopment) {
    return <>{children}</>;
  }

  // In production, check authentication
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
