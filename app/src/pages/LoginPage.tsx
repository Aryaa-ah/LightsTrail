import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { authService } from "../services/auth";

import React from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", `Bearer ${data.token}`);
      localStorage.setItem("user", JSON.stringify(data.user));
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "http://localhost:3002/auth/google",
      "Google Sign In",
      `width=${width},height=${height},left=${left},top=${top},popup=1`
    );

    // Setup message listener
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "AUTH_SUCCESS") {
        // Parse the URL search params from the popup
        const searchParams = new URLSearchParams(event.data.data);
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");

        if (token && userStr) {
          try {
            const user = JSON.parse(decodeURIComponent(userStr));
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/home");
          } catch (error) {
            console.error("Error processing auth data:", error);
          }
        }
      }
      // Clean up event listener
      window.removeEventListener("message", messageHandler);
    };

    window.addEventListener("message", messageHandler);

    // Check if popup was blocked
    if (popup === null) {
      setError("Please allow popups for Google sign in");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       // background: "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
      }}
    >
      <Card
        sx={{
          p: 4,
          maxWidth: 400,
          width: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ mb: 4, color: "white" }}
        >
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: "white" },
            }}
            InputLabelProps={{
              sx: { color: "rgba(255, 255, 255, 0.7)" },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              sx: { color: "white" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: { color: "rgba(255, 255, 255, 0.7)" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 2, color: "white" }}>OR</Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          sx={{
            mb: 2,
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" textAlign="center" sx={{ color: "white" }}>
          Don't have an account?{" "}
          <Link to="/auth/signup" style={{ color: "#90caf9" }}>
            Sign up
          </Link>
        </Typography>

      </Card>
    </Box>
  );
}
