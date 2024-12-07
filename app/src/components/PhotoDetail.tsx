/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/auth";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
  Avatar,
  useTheme,
  alpha,
  DialogContent,
  Button,
  Dialog as ConfirmDialog,
  DialogTitle,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
  // Fade,
} from "@mui/material";
import {
  Close,
  LocationOn,
  CalendarToday,
  Download,
  Delete,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Photo } from "../types/gallery.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { deletePhoto } from "../store/gallerySlice";
import { usePhotoPermissions } from "../hooks/usePhotoPermissions";

const dialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
};

interface PhotoDetailProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onPhotoDeleted?: () => void;
  onUpdatePhoto?: (photoId: string, updates: { location: string }) => void;
}

const PhotoDetail: React.FC<PhotoDetailProps> = ({
  photo,
  isOpen,
  onClose,
  onPhotoDeleted,
  onUpdatePhoto,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { canModify, isLoggedIn: _isLoggedIn } = usePhotoPermissions(
    photo as Photo
  );
  if (!photo) return null;

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

  // gets the image URL from the photo object
  const getImageUrl = (photoUrl: string): string => {
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${BACKEND_URL}${photoUrl}`;
  };

  // handles the download of the photo when the download button is clicked
  const handleDownload = async () => {
    try {
      const response = await fetch(getImageUrl(photo.url));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `aurora-${photo.location}-${format(
        new Date(photo.createdAt),
        "yyyy-MM-dd"
      )}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download photo:", error);
    }
  };
  // handles the deletion of the photo when the delete button is clicked
  const handleDelete = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const userName = currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : null;

      if (!userName) {
        setError("You must be logged in to delete photos");
        setShowErrorAlert(true); // show the error alert
        return;
      }

      // Compares the photo owner with current user before attempting deletion
      if (photo.userName !== userName) {
        setError("You can only delete your own photos");
        setShowErrorAlert(true); // show the error alert
        return;
      }

      await dispatch(
        deletePhoto({
          photoId: photo.id,
          userName,
        })
      ).unwrap();

      setIsDeleteDialogOpen(false);
      onClose();
      if (onPhotoDeleted) {
        onPhotoDeleted();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setShowErrorAlert(true);
    }
  };
  // handles the editing of the photo location when the edit button is clicked
  const handleEdit = () => {
    setEditedLocation(photo?.location || "");
    setIsEditing(true);
  };
  // saving the edited location
  const handleSave = () => {
    if (photo && onUpdatePhoto) {
      onUpdatePhoto(photo.id, {
        location: editedLocation,
      });
    }
    setIsEditing(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="lg"
            PaperProps={{
              component: motion.div,
              variants: dialogVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              sx: {
                bgcolor: "background.paper",
                borderRadius: 2,
                overflow: "hidden",
                maxHeight: "90vh",
                m: 2,
              },
            }}
          >
            <DialogContent sx={{ p: 0, position: "relative" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  maxHeight: "90vh",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flex: "1 1 60%",
                    position: "relative",
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.95
                    ),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: theme.spacing(2),
                  }}
                >
                  <motion.img
                    src={getImageUrl(photo.url)}
                    alt={`Aurora at ${photo.location}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                      borderRadius: theme.shape.borderRadius,
                    }}
                  />
                </motion.div>

                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    flex: "1 1 40%",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                    maxHeight: "90vh",
                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      borderBottom: `1px solid ${alpha(
                        theme.palette.divider,
                        0.1
                      )}`,
                    }}
                  >
                    <Tooltip title="Download">
                      <IconButton onClick={handleDownload} size="small">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => setIsDeleteDialogOpen(true)}
                        size="small"
                        sx={{ color: "error.main" }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <IconButton onClick={onClose} size="small">
                      <Close />
                    </IconButton>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Avatar
                        src={`https://api.dicebear.com/9.x/identicon/svg?seed=${
                          photo.userName ||
                          Math.random().toString(36).substring(7)
                        }c0aede,d1d4f9&scale=80&size=32&radius=50`}
                        sx={{
                          width: 32,
                          height: 32,
                          border: `2px solid ${alpha(
                            theme.palette.common.white,
                            0.8
                          )}`,
                        }}
                      />
                      <Box>
                        <Typography variant="h6">{photo.userName}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarToday sx={{ fontSize: 14 }} />
                          {format(new Date(photo.createdAt), "MMMM dd, yyyy")}
                        </Typography>
                      </Box>
                    </Box>

                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <TextField
                              fullWidth
                              label="Location"
                              value={editedLocation}
                              onChange={(e) =>
                                setEditedLocation(e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <LocationOn
                                    sx={{ color: "primary.main", mr: 1 }}
                                  />
                                ),
                              }}
                            />
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                              <Button
                                startIcon={<Cancel />}
                                onClick={() => setIsEditing(false)}
                                variant="outlined"
                                fullWidth
                              >
                                Cancel
                              </Button>
                              <Button
                                startIcon={<Save />}
                                onClick={handleSave}
                                variant="contained"
                                fullWidth
                              >
                                Save Changes
                              </Button>
                            </Box>
                          </Box>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOn sx={{ color: "primary.main" }} />
                              <Typography variant="body1">
                                {photo.location}
                              </Typography>
                            </Box>
                              {/* the edit button only shows to the photo owner
                               */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {canModify() && (
                                <>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      onClick={handleEdit}
                                      size="small"
                                      sx={{ color: "primary.main" }}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  {/* <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() =>
                                        setIsDeleteDialogOpen(true)
                                      }
                                      size="small"
                                      sx={{ color: "error.main" }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip> */}
                                </>
                              )}
                            </Box>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </motion.div>
              </Box>
            </DialogContent>
          </Dialog>

          <AnimatePresence>
            {isDeleteDialogOpen && (
              <ConfirmDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                  component: motion.div,
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.9 },
                  transition: { duration: 0.2 },
                }}
              >
                <DialogTitle>Delete Photo</DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete this photo? This action
                    cannot be undone.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </ConfirmDialog>
            )}
          </AnimatePresence>

          <Snackbar
            open={showErrorAlert}
            autoHideDuration={6000}
            onClose={() => setShowErrorAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setShowErrorAlert(false)}
              severity="error"
              sx={{
                width: "100%",
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "& .MuiAlert-icon": {
                  color: "error.main",
                },
              }}
            >
              {error}
            </Alert>
          </Snackbar>
        </>
      )}
    </AnimatePresence>
  );
};

export default PhotoDetail;
