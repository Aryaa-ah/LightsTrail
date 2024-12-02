// src/hooks/useAuth.ts
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/authSice";

interface User {
  id: string;
  username: string;
  email: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  provider?: 'local' | 'google';
  avatar?: string;
  createdAt?: string;
}

export const useAuth = () => {
  // Get auth state from Redux store
  const auth = useSelector((state: RootState) => state.auth);

  // For now, return mock data if you haven't implemented auth yet
  return {
    user:
      auth?.user ||
      ({
        id: "1",
        username: "testUser",
        email: "test@example.com",
      } as User),
    isAuthenticated: true, // Temporarily set to true for development
    loading: false,
    error: null,
    logout,
  };
};

export type { User };
