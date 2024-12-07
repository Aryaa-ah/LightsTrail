import { useState, useCallback, useEffect } from "react";
import {
  ImageList,
  ImageListItem,
  IconButton,
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
  alpha,
  Avatar,
  Typography,
  Tooltip,
} from "@mui/material";
import { LocationOn, Download, CalendarToday, Share } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import React from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
    borderColor: alpha(theme.palette.primary.main, 0.3),
    "& .image-overlay": {
      opacity: 1,
    },
    "& .photo-actions": {
      transform: "translateY(0)",
      opacity: 1,
    },
    "& img": {
      transform: "scale(1.05)",
    },
  },
}));

const LocationLabel = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(0.5, 1.5),
  background: "transparent",
  transition: "opacity 0.3s ease",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.white,
  textShadow: `1px 1px 3px ${alpha(theme.palette.common.black, 0.8)}`,
  "& .MuiSvgIcon-root": {
    filter: "drop-shadow(1px 1px 3px rgba(0,0,0,0.8))",
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to top, 
    ${alpha(theme.palette.background.default, 0.95)} 0%, 
    ${alpha(theme.palette.background.default, 0.5)} 50%, 
    transparent 100%)`,
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
  "&:hover": {
    opacity: 1,
    "& + .location-label": {
      opacity: 0,
    },
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(1),
  transform: "translateY(-10px)",
  opacity: 0,
  transition: "all 0.3s ease",
  zIndex: 2,
}));

export interface GalleryGridProps {
  photos: Photo[];
  viewMode: "grid" | "list";
  onPhotoClick: (photo: Photo) => void;
}

// Add a new interface for image loading states
interface ImageLoadingState {
  [key: string]: {
    loaded: boolean;
    retries: number;
    error: boolean;
  };
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  viewMode,
  onPhotoClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [imageStates, setImageStates] = useState<ImageLoadingState>({});

  // Preload images when component mounts
  useEffect(() => {
    const preloadImages = async () => {
      photos.forEach((photo) => {
        const img = new Image();
        const imageUrl = photo.url.startsWith("http") 
          ? photo.url 
          : `${BACKEND_URL}${photo.url}`;

        img.src = imageUrl;
        
        img.onload = () => {
          setImageStates(prev => ({
            ...prev,
            [photo.id]: {
              loaded: true,
              retries: 0,
              error: false
            }
          }));
        };

        img.onerror = () => {
          retryLoading(photo);
        };
      });
    };

    preloadImages();
  }, [photos]);

  const getImageListCols = () => {
    if (viewMode === "list") return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  // Add retry logic
  const retryLoading = useCallback((photo: Photo, attempt = 0) => {

  // Handle no results case
  if (!photos.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
            No photos found
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: "500px" }}
          >
            Try adjusting your search or explore other locations
          </Typography>
        </Box>
      </motion.div>
    );
  }
    if (attempt >= 3) {
      setImageStates(prev => ({
        ...prev,
        [photo.id]: {
          loaded: false,
          retries: attempt,
          error: true
        }
      }));
      return;
    }

    setTimeout(() => {
      const img = new Image();
      const imageUrl = photo.url.startsWith("http") 
        ? photo.url 
        : `${BACKEND_URL}${photo.url}`;

      img.src = imageUrl;
      
      img.onload = () => {
        setImageStates(prev => ({
          ...prev,
          [photo.id]: {
            loaded: true,
            retries: attempt,
            error: false
          }
        }));
      };

      img.onerror = () => {
        retryLoading(photo, attempt + 1);
      };
    }, 1000 * attempt); // Exponential backoff
  }, []);

  const handleDownload = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        photo.url.startsWith("http") ? photo.url : `${BACKEND_URL}${photo.url}`
      );
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

  // Add share handler
  const handleShare = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation(); // Prevent photo click event
    
    if (!navigator.share) {
      console.log('Web Share API not supported');
      return;
    }

    try {
      await navigator.share({
        title: `Aurora photo from ${photo.location}`,
        text: `Check out this amazing aurora photo taken at ${photo.location}!`,
        url: window.location.origin + `/gallery/${photo.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ImageList
      cols={getImageListCols()}
      gap={15}
      sx={{
        m: 0,
        mt: 2, // Add top margin here
        "& .MuiImageListItem-root": {
          overflow: "hidden",
        },
      }}
      rowHeight={viewMode === "list" ? 300 : 400}
    >
      <AnimatePresence>
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StyledImageListItem onClick={() => onPhotoClick(photo)}>
              {(!imageStates[photo.id]?.loaded) && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={viewMode === "list" ? 300 : 400}
                  animation="wave"
                />
              )}

              <img
                src={
                  photo.url.startsWith("http") 
                    ? photo.url
                    : `${BACKEND_URL}${photo.url}`
                }
                alt={`Aurora at ${photo.location}`}
                loading="lazy"
                style={{
                  display: imageStates[photo.id]?.loaded ? 'block' : 'none',
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
              />

              {imageStates[photo.id]?.error && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Typography color="error">
                    Failed to load image
                  </Typography>
                </Box>
              )}

              <ActionButtons className="photo-actions">
                <IconButton
                  size="medium"
                  onClick={(e) => handleShare(e, photo)}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.95)',
                    },
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDownload(e, photo)}
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.paper, 0.95),
                      },
                    }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </ActionButtons>

              <ImageOverlay className="image-overlay hover-overlay">
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                      <Typography variant="body2" color="common.white">
                        {photo.userName}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarToday sx={{ fontSize: 14, color: "white" }} />
                        <Typography variant="caption" color="common.white">
                          {format(new Date(photo.createdAt), "MMM dd, yyyy")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 2,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 29, color: "white" }} />
                    <Typography variant="body2" color="common.white">
                      {photo.location}
                    </Typography>
                  </Box>
                </Box>
              </ImageOverlay>

              <LocationLabel className="location-label">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ fontSize: 30, color: "white" }} />
                  <Typography variant="body2" color="common.white">
                    {photo.location}
                  </Typography>
                </Box>
              </LocationLabel>
            </StyledImageListItem>
          </motion.div>
        ))}
      </AnimatePresence>
    </ImageList>
  );
};

export default GalleryGrid;
