// src/features/gallery/components/PhotoUpload.tsx
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  styled,
  alpha,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Photo } from "../types/gallery.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../src/store";
import { uploadPhoto, fetchPhotos } from "../store/gallerySlice";
// Styled Components
const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragActive",
})<{ isDragActive?: boolean }>(({ theme, isDragActive }) => ({
  border: `2px dashed ${
    isDragActive ? theme.palette.primary.main : theme.palette.grey[700]
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: isDragActive
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  "&:hover": {
    borderColor: isDragActive
      ? theme.palette.primary.main
      : theme.palette.grey[600],
  },
}));

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
  onUploadSuccess?: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  isOpen,
  onClose,
  // onUpload,
  onUploadSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  // Update the handleUpload function
  const handleUpload = async () => {
    if (!selectedFile || !location) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile, selectedFile.name);
      formData.append("location", location);
      formData.append("userName", "testUser");

      const uploadedPhoto = await dispatch(uploadPhoto(formData));
      if (uploadPhoto.fulfilled.match(uploadedPhoto)) {
        await dispatch(fetchPhotos({ page: 1, limit: 12 }));

        if (onUploadSuccess) {
          onUploadSuccess();
        }

        // Reset form and close modal
        resetForm();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview("");
    setLocation("");
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
        }}
      >
        <CameraIcon />
        <Typography variant="h6">Upload Aurora Photo</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {uploading && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        />
      )}

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Drop Zone */}
          <DropZone {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            {preview ? (
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    maxHeight: 256,
                    maxWidth: "100%",
                    borderRadius: 1,
                    objectFit: "contain",
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreview("");
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.8)",
                    },
                  }}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <CameraIcon
                  sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Drag & drop an image here, or click to select
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maximum file size: 5MB
                </Typography>
              </Box>
            )}
          </DropZone>

          {/* Location Input */}
          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Tromsø, Norway"
            InputProps={{
              startAdornment: (
                <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            variant="outlined"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={resetForm}
          disabled={uploading}
          sx={{
            borderColor: "grey.700",
            color: "text.primary",
            "&:hover": {
              borderColor: "grey.600",
              bgcolor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !location}
          sx={{
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            minWidth: 100,
          }}
        >
          {uploading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Uploading...
            </Box>
          ) : (
            "Upload Photo"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoUpload;
