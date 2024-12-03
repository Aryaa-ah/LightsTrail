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
  DialogContent as ConfirmDialogContent,
} from "@mui/material";
import {
  Close,
  LocationOn,
  CalendarToday,
  Download,
  Delete,
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
}

const PhotoDetail: React.FC<PhotoDetailProps> = ({
  photo,
  isOpen,
  onClose,
  onPhotoDeleted,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            borderRadius: 1,
            overflow: "hidden",
            maxHeight: "80vh",
            m: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
            }}
          >
            {/* Image Container */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: alpha(theme.palette.background.default, 0.95),
                maxHeight: "60vh",
                overflow: "hidden",
              }}
            >
              <img
                src={getImageUrl(photo.url)}
                alt={`Aurora at ${photo.location}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                }}
              />
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Details Container */}
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
              }}
            >
              {/* User Info and Date */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${photo.userName}`}
                    sx={{ width: 32, height: 32 }}
                  >
                    {photo.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle1">{photo.userName}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarToday
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(photo.createdAt), "MMM dd, yyyy")}
                  </Typography>
                </Box>
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: photo.description ? 1 : 0,
                }}
              >
                <LocationOn sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2">{photo.location}</Typography>
              </Box>

              {/* Description */}
              {photo.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {photo.description}
                </Typography>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  onClick={() => setIsDeleteDialogOpen(true)}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.error.main, 0.2),
                    },
                    color: theme.palette.error.main,
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleDownload}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                    },
                  }}
                >
                  <Download fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
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
      </Dialog>
    </>
  );
};

export default PhotoDetail;
