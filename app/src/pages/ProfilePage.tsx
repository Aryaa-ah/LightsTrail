import React from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import { authService } from "../services/auth";
import type { User } from "../types/auth";

const ProfilePage = () => {
  const user = authService.getCurrentUser();

  if (!user) {
    return (
      <Box sx={{ paddingTop: "74px" }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography>No user data available</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ paddingTop: "74px" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography variant="h5" sx={{ mb: 4, color: "white" }}>
          User Profile
        </Typography>

        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Left Column - Profile Picture */}
          <Card
            sx={{
              width: 280,
              height: "fit-content",
              bgcolor: "rgba(17, 25, 40, 0.75)",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#2196F3",
                fontSize: "2.5rem",
              }}
              src={user.avatar}
            >
              {user.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ color: "white", mt: 2 }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Card>

          {/* Right Column - User Details */}
          <Card
            sx={{
              flex: 1,
              bgcolor: "rgba(17, 25, 40, 0.75)",
              p: 4,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
              >
                {/* First Name */}
                <Box>
                  <Typography sx={{ mb: 1, color: "rgba(255,255,255,0.7)" }}>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={user.firstName}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(0,0,0,0.2)",
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.1)",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "white",
                        WebkitTextFillColor: "white",
                      },
                    }}
                  />
                </Box>

                {/* Last Name */}
                <Box>
                  <Typography sx={{ mb: 1, color: "rgba(255,255,255,0.7)" }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={user.lastName}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(0,0,0,0.2)",
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.1)",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "white",
                        WebkitTextFillColor: "white",
                      },
                    }}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography sx={{ mb: 1, color: "rgba(255,255,255,0.7)" }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={user.email}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(0,0,0,0.2)",
                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.1)",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "white",
                        WebkitTextFillColor: "white",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Save Button
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: '#2196F3',
                    '&:hover': {
                      bgcolor: '#1976D2'
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box> */}
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
