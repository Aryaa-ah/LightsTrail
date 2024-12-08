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
import React from "react";

interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
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
      const response = await fetch("http://localhost:3002/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
        // background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
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
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "rgba(255, 255, 255, 0.7)" },
              }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "rgba(255, 255, 255, 0.7)" },
              }}
            />
          </Box>

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
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <Divider sx={{ my: 2, color: "white" }}>OR</Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<Google />}
          onClick={handleGoogleSignup}
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
          Already have an account?{" "}
          <Link to="/auth/login" style={{ color: "#90caf9" }}>
            Sign in
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}
