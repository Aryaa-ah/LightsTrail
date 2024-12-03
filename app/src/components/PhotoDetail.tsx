/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
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
  DialogContent as ConfirmDialogContent,
  Tooltip,
  Fade,
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
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Photo } from "../types/gallery.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { deletePhoto } from "../store/gallerySlice";

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
  const [editedDescription, setEditedDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  if (!photo) return null;

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

  const getImageUrl = (photoUrl: string): string => {
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${BACKEND_URL}${photoUrl}`;
  };

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

  const handleDelete = async () => {
    try {
      await dispatch(deletePhoto(photo.id)).unwrap();
      setIsDeleteDialogOpen(false);
      onClose();
      if (onPhotoDeleted) {
        onPhotoDeleted();
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  const handleEdit = () => {
    setEditedLocation(photo?.location || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (photo && onUpdatePhoto) {
      onUpdatePhoto(photo.id, {
        location: editedLocation,
      });
    }
    setIsEditing(false);
  };

  const toggleVisibility = () => {
    setIsPrivate(!isPrivate);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="lg"
        PaperProps={{
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
          {/* Main Content Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              maxHeight: "90vh",
            }}
          >
            {/* Left Side - Image */}
            <Box
              sx={{
                flex: "1 1 60%",
                position: "relative",
                bgcolor: alpha(theme.palette.background.default, 0.95),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <img
                src={getImageUrl(photo.url)}
                alt={`Aurora at ${photo.location}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: theme.shape.borderRadius,
                }}
              />
            </Box>

            {/* Right Side - Details */}
            <Box
              sx={{
                flex: "1 1 40%",
                display: "flex",
                flexDirection: "column",
                borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                maxHeight: "90vh",
                overflow: "auto",
              }}
            >
              {/* Header Actions */}
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

              {/* Content */}
              <Box sx={{ p: 3 }}>
                {/* User Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${photo.userName}`}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box>
                    <Typography variant="h6">{photo.userName}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarToday sx={{ fontSize: 14 }} />
                      {format(new Date(photo.createdAt), "MMMM dd, yyyy")}
                    </Typography>
                  </Box>
                </Box>

                {/* Location */}
                {isEditing ? (
                  <Fade in={isEditing}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="Location"
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <LocationOn sx={{ color: "primary.main", mr: 1 }} />
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
                  </Fade>
                ) : (
                  <Fade in={!isEditing}>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOn sx={{ color: "primary.main" }} />
                          <Typography variant="body1">
                            {photo.location}
                          </Typography>
                        </Box>
                        <Button
                          startIcon={<Edit />}
                          onClick={handleEdit}
                          variant="outlined"
                          size="small"
                        >
                          Edit
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Photo</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this photo? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </>
  );
};

export default PhotoDetail;
