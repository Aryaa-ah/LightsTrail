/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/gallery/components/PhotoUpload.tsx
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  styled,
  useTheme,
  alpha,
  Chip,
  // Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  LocationOn,
} from "@mui/icons-material";
import { Photo } from "../types/gallery.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../src/store";
import { uploadPhoto, fetchPhotos } from "../store/gallerySlice";
import { authService } from "../services/auth";
// Styled Components

const PreviewImage = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "300px",
  objectFit: "contain",
  borderRadius: "4px",
});

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragActive" && prop !== "hasFile",
})<{ isDragActive?: boolean; hasFile?: boolean }>(
  ({ theme, isDragActive, hasFile }) => ({
    border: `2px dashed ${
      isDragActive
        ? theme.palette.primary.main
        : hasFile
        ? alpha(theme.palette.primary.main, 0.5)
        : theme.palette.divider
    }`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    backgroundColor: isDragActive
      ? alpha(theme.palette.primary.main, 0.1)
      : hasFile
      ? alpha(theme.palette.primary.main, 0.05)
      : "transparent",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      borderColor: theme.palette.primary.main,
    },
  })
);

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
  onUploadSuccess?: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currentUser = authService.getCurrentUser();
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Anonymous";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  // Simulate progress for the upload
  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        clearInterval(interval);
      } else {
        setUploadProgress(Math.min(progress, 90));
      }
    }, 500);
  };

  // Update the handleUpload function
  const handleUpload = async () => {
    if (!selectedFile || !location) return;

    try {
      setUploading(true);
      simulateProgress();

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("userName", userName); // this adds the userName to the form data

      await dispatch(uploadPhoto(formData)).unwrap();
      setUploadProgress(100);

      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        resetForm();
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview("");
    setLocation("");
    setDescription("");
    setUploadProgress(0);
    setUploading(false);
    onClose();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={uploading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
      >
        <UploadIcon />
        <Typography variant="h6">Upload Aurora Photo</Typography>
        {!uploading && (
          <IconButton onClick={onClose} sx={{ ml: "auto" }} aria-label="close">
            <CloseIcon />
          </IconButton>
        )}
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
            height: 4,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      )}

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DropZone
                {...getRootProps()}
                isDragActive={isDragActive}
                hasFile={!!preview}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <Box sx={{ position: "relative" }}>
                    <PreviewImage src={preview} alt="Preview" />
                    {!uploading && (
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
                          bgcolor: alpha(theme.palette.background.paper, 0.9),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.background.paper, 0.7),
                          },
                        }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Chip
                      label={selectedFile?.name}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(4px)",
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <motion.div
                      animate={{ scale: isDragActive ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ImageIcon
                        sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop an image here"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to select from your computer
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Maximum file size: 5MB
                      </Typography>
                    </motion.div>
                  </Box>
                )}
              </DropZone>
            </motion.div>
          </AnimatePresence>

          <TextField
            fullWidth
            required
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Tromsø, Norway"
            disabled={uploading}
            InputProps={{
              startAdornment: (
                <LocationOn sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
          />
        </Box>
      </DialogContent>

      <Box
        sx={{ display: "flex", gap: 2, p: 2, bgcolor: "background.default" }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={resetForm}
          disabled={uploading}
          sx={{
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: "text.primary",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !location}
          sx={{
            position: "relative",
            background: "linear-gradient(45deg, #84fab0 30%, #8fd3f4 90%)",
            color: "black", // Explicitly set text color to black
            "&:hover": {
              background: "linear-gradient(45deg, #84fab0 40%, #8fd3f4 100%)",
            },
          }}
        >
          {uploading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  color: "black", // Match progress indicator to text
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-12px",
                }}
              />
              <Box sx={{ opacity: 0, color: "black" }}>Uploading...</Box>
            </>
          ) : (
            "Upload Photo"
          )}
        </Button>
      </Box>
    </Dialog>
  );
};

export default PhotoUpload;
