import { useState, useCallback } from "react";
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
import { LocationOn, Download, CalendarToday } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

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

const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  viewMode,
  onPhotoClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const getImageListCols = () => {
    if (viewMode === "list") return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const handleImageLoad = useCallback((photoId: string) => {
    setLoadedImages((prev) => ({ ...prev, [photoId]: true }));
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>, photo: Photo) => {
      console.error(`Failed to load image: ${photo.url}`);
      e.currentTarget.src = PLACEHOLDER_IMAGE;
      setLoadedImages((prev) => ({ ...prev, [photo.id]: true }));
    },
    []
  );

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
              {!loadedImages[photo.id] && (
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
                onLoad={() => handleImageLoad(photo.id)}
                onError={(e) => handleImageError(e, photo)}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  display: loadedImages[photo.id] ? "block" : "none",
                }}
              />

              <ActionButtons className="photo-actions">
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

              <ImageOverlay className="image-overlay">
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${photo.userName}`}
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
            </StyledImageListItem>
          </motion.div>
        ))}
      </AnimatePresence>
    </ImageList>
  );
};

export default GalleryGrid;
