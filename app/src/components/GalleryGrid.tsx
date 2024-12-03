/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from "@mui/material";
import { LocationOn, Favorite, Download } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";
import { motion } from "framer-motion";
import { format } from "date-fns";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

const StyledImageListItemBase = styled(ImageListItem)(({ theme }) => ({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: alpha(theme.palette.primary.main, 0.3),
    "& .image-overlay": {
      opacity: 1,
    },
    "& .photo-info": {
      transform: "translateY(0)",
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
    ${alpha(theme.palette.background.default, 0.9)} 0%, 
    ${alpha(theme.palette.background.default, 0.5)} 50%, 
    transparent 100%)`,
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
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
    e.stopPropagation(); // Prevent opening photo detail view
    
    try {
      const response = await fetch(photo.url.startsWith("http") 
        ? photo.url 
        : `${BACKEND_URL}${photo.url}`
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aurora-${photo.location}-${format(new Date(photo.createdAt), 'yyyy-MM-dd')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download photo:', error);
    }
  };

  return (
    <ImageList
      cols={getImageListCols()}
      gap={24}
      sx={{
        m: 0,
        ".MuiImageListItem-root": {
          overflow: "hidden",
        },
      }}
      rowHeight={viewMode === "list" ? 300 : 400}
    >
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StyledImageListItemBase onClick={() => onPhotoClick(photo)}>
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
                display: loadedImages[photo.id] ? "block" : "none",
              }}
            />

            <ImageOverlay className="image-overlay">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box>
                  <Typography variant="h6" color="common.white" gutterBottom>
                    {photo.location}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      alt={photo.userName}
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${photo.userName}`}
                    />
                    <Typography variant="body2" color="common.white">
                      {photo.userName}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton 
                    size="small" 
                    sx={{ color: "common.white" }}
                    onClick={(e) => handleDownload(e, photo)}
                  >
                    <Download />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
              >
                <LocationOn fontSize="small" sx={{ color: "common.white" }} />
                <Typography variant="caption" color="common.white">
                  {format(new Date(photo.createdAt), "MMMM dd, yyyy")}
                </Typography>
              </Box>
            </ImageOverlay>
          </StyledImageListItemBase>
        </motion.div>
      ))}
    </ImageList>
  );
};

export default GalleryGrid;
