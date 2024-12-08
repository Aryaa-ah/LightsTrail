import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  DeleteOutline,
  EmailOutlined,
  AccountCircle,
  Notifications,
  Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import AlertPreferencesComponent from "../components/AlertPreferences";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logoColor = "#84fab0"; // Profile logo color
  const gradientColors = "linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)";

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteAccount();
      localStorage.clear();
      navigate("/auth/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profile.deleteError"));
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "64px",
        // background: `linear-gradient(135deg, 
        //   ${theme.palette.background.default} 0%,
        //   ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mx: "auto", width: "85%" }}> {/* Center container */}
          <Grid container spacing={3}>
            {/* Profile Info Section - Left Column */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  border: `1px solid ${logoColor}30`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                        fontSize: "2rem",
                        background: gradientColors,
                        border: `3px solid ${logoColor}40`,
                      }}
                    >
                      {user?.firstName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: logoColor, mb: 1 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <EmailOutlined fontSize="small" />
                      <Typography variant="body2">{user?.email}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="First Name"
                          value={user?.firstName}
                          disabled
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "rgba(255, 255, 255, 0.02)",
                              borderColor: `${logoColor}30`,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Last Name"
                          value={user?.lastName}
                          disabled
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "rgba(255, 255, 255, 0.02)",
                              borderColor: `${logoColor}30`,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenDialog(true)}
                    startIcon={<DeleteOutline />}
                    size="small"
                    sx={{
                      borderColor: "rgba(255,0,0,0.2)",
                      "&:hover": {
                        borderColor: "error.main",
                        backgroundColor: "rgba(255,0,0,0.05)",
                      },
                    }}
                  >
                    {t("profile.deleteAccount")}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Alert Preferences Section - Right Column */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  border: `1px solid ${logoColor}30`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    <Notifications
                      sx={{
                        color: logoColor,
                        fontSize: 24,
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ color: logoColor }}>
                      {t("profile.alertPreferences")}
                    </Typography>
                  </Box>
                  <AlertPreferencesComponent />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Delete Account Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !loading && setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            maxWidth: "400px",
          }
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Security color="error" />
          <Typography variant="h6" color="error">
            {t("profile.deleteAccountTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t("profile.deleteConfirmation")}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            size="small"
            onClick={() => setOpenDialog(false)}
            disabled={loading}
          >
            {t("profile.cancel")}
          </Button>
          <Button
            size="small"
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <DeleteOutline />
            }
          >
            {loading ? t("profile.deleting") : t("profile.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;