import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { Google } from "@mui/icons-material";
import { authService } from "../services/auth";
import { LoginCredentials } from "../types/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    authService.handleGoogleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      // Auth service handles token storage and redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Username"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 2 }}>
                  👤
                </Box>
              ),
            }}
            sx={{
              //   bgcolor: "white",
              borderRadius: 2,
              //   "& .MuiOutlinedInput-root": {
              //     borderRadius: 2,
              //   },
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Password"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ mr: 2 }}>
                  🔒
                </Box>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </IconButton>
              ),
            }}
            sx={{
              //   bgcolor: "white",
              borderRadius: 2,
              //   "& .MuiOutlinedInput-root": {
              //     borderRadius: 2,
              //   },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              py: 1.5,
              bgcolor: "#4285f4",
              borderRadius: 6,
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "#3367d6",
              },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#4285f4",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                SignUP
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 2,
            }}
          >
            <Box sx={{ flex: 1, borderBottom: 1, borderColor: "divider" }} />
            <Typography sx={{ px: 2, color: "text.secondary" }}>Or</Typography>
            <Box sx={{ flex: 1, borderBottom: 1, borderColor: "divider" }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            startIcon={<Google />}
            sx={{
              py: 1.5,
              borderRadius: 6,
              borderColor: "#ddd",
              color: "text.primary",
              textTransform: "none",
              fontSize: "1rem",
              //bgcolor: "white",
              "&:hover": {
                bgcolor: "#808080",
                borderColor: "#ddd",
              },
            }}
          >
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
