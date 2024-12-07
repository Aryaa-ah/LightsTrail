import React, { useState, useEffect } from "react";
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
  useTheme,
  MobileStepper,
  CircularProgress,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
 
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
 
// Types
interface LoginFormData {
  email: string;
  password: string;
}
 
interface CarouselSlide {
  label: string;
  description: string;
  imgPath: string;
}
 
// Constants
const GOOGLE_AUTH_URL = "http://localhost:3002/auth/google";
const LOGIN_API_URL = "http://localhost:3002/auth/login";
 
const carouselContent: CarouselSlide[] = [
  {
    label: "Track Aurora in Real-Time",
    description: "Get instant notifications when aurora is visible",
    imgPath: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938",
  },
  {
    label: "Join Our Community",
    description: "Connect with aurora enthusiasts",
    imgPath: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
  },
  {
    label: "Never Miss the Northern Lights",
    description: "Get personalized aurora alerts",
    imgPath: "https://images.unsplash.com/photo-1494243762909-b498c7e440a9",
  },
];
 
// Form validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
 
const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
 
export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
 
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
 
  // Form validation handler
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
 
    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
 
    if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 6 characters long";
    }
 
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
 
  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    setValidationErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };
 
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!validateForm()) {
      return;
    }
 
    setLoading(true);
    setError("");
 
    try {
      const response = await fetch(LOGIN_API_URL, {
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
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };
 
  // Google OAuth handler
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
 
    const popup = window.open(
      GOOGLE_AUTH_URL,
      "Google Sign In",
      `width=${width},height=${height},left=${left},top=${top},popup=1`
    );
 
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
 
      if (event.data?.type === "AUTH_SUCCESS") {
        try {
          const searchParams = new URLSearchParams(event.data.data);
          const token = searchParams.get("token");
          const userStr = searchParams.get("user");
 
          if (token && userStr) {
            const user = JSON.parse(decodeURIComponent(userStr));
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/home");
          }
        } catch (error) {
          console.error("Error processing auth data:", error);
          setError("Failed to process Google login");
        }
      }
      window.removeEventListener("message", messageHandler);
    };
 
    window.addEventListener("message", messageHandler);
 
    if (popup === null) {
      setError("Please allow popups for Google sign in");
    }
  };
 
  // Carousel handlers
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
 
  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any resources if needed
    };
  }, []);
 
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        p: 4,
      }}
    >
      {/* Carousel Card */}
      <Card
        elevation={4}
        sx={{
          display: { xs: "none", md: "block" },
          width: "600px",
          height: "600px",
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          scrollbarWidth: "none",
          bgcolor: "transparent",
        }}
      >
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          interval={5000}
        >
          {carouselContent.map((slide, index) => (
            <div key={slide.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box sx={{ position: "relative", height: "600px" }}>
                  <Box
                    component="img"
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    src={slide.imgPath}
                    alt={slide.label}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: "rgba(0,0,0,0.5)",
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        mb: 1,
                      }}
                    >
                      {slide.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {slide.description}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
 
        <MobileStepper
          steps={carouselContent.length}
          position="bottom"
          activeStep={activeStep}
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "transparent",
            "& .MuiMobileStepper-dot": {
              bgcolor: "rgba(255,255,255,0.5)",
            },
            "& .MuiMobileStepper-dotActive": {
              bgcolor: "white",
            },
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />
      </Card>
 
      {/* Login Form Card */}
 
      <Card
        sx={{
          p: 4,
          width: "400px",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              // fontWeight: 600,
              background: "linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              mb: 1,
            }}
          >
            <h5>LightsTrail </h5>
          </Typography>
          <Divider
            sx={{
              width: "50%",
              margin: "0 auto",
              borderColor: "rgba(255,255,255,0.3)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              height: "2px",
            }}
          />
        </Box>
 
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
            error={!!validationErrors.email}
            helperText={validationErrors.email}
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
            error={!!validationErrors.password}
            helperText={validationErrors.password}
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
            sx={{
              mb: 2,
              py: 1.5,
              background: "linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)",
              border: 0,
              borderRadius: 2,
              boxShadow: "0 3px 5px 2px rgba(132, 250, 176, .3)",
              color: "background.paper",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(45deg, #72e6a0 10%, #7bc8f0 90%)",
                transform: "scale(1.02)",
              },
              "&:disabled": {
                background: "linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)",
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "background.paper",
                  opacity: 0.9,
                }}
              />
            ) : (
              "Sign In"
            )}
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