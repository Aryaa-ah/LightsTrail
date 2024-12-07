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
  Divider,
  Paper,
} from "@mui/material";

import { DeleteOutline, EmailOutlined } from "@mui/icons-material";
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

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.deleteAccount();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.deleteError'));
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      pt: "64px",
      overflowY: "auto"
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
          {/* Left Sidebar */}
          <Paper 
            elevation={0}
            sx={{
              flex: "0 0 300px",
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  fontSize: "3rem",
                  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                }}
              >
                {user?.firstName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <EmailOutlined fontSize="small" />
                {user?.email}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => setOpenDialog(true)}
              startIcon={<DeleteOutline />}
              sx={{ mt: 2 }}
            >
              {t('profile.deleteAccount')}
            </Button>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('profile.personalInfo')}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  label={t('profile.firstName')}
                  value={user?.firstName}
                  disabled
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label={t('profile.lastName')}
                  value={user?.lastName}
                  disabled
                  variant="outlined"
                />
              </Box>
            </Paper>

            {/* Alert Preferences Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('profile.alertPreferences')}
              </Typography>
              <AlertPreferencesComponent />
            </Paper>
          </Box>
        </Box>

        {/* Delete Account Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => !loading && setOpenDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: "background.paper",
              backdropFilter: "blur(20px)",
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>{t('profile.deleteAccountTitle')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('profile.deleteConfirmation')}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={loading}>
              {t('profile.cancel')}
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteOutline />}
            >
              {loading ? t('profile.deleting') : t('profile.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProfilePage;