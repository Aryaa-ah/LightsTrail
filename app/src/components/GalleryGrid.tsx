/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";

const BACKEND_URL = "http://localhost:3002";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PLACEHOLDER_IMAGE = "/app/src/assets/mock.jpg";

const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[900],
  "& img": {
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover img": {
    transform: "scale(1.05)",
  },
}));

const StyledImageListItemBar = styled(ImageListItemBar)(({ theme }) => ({
  background:
    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  ".MuiImageListItemBar-title": {
    color: theme.palette.common.white,
  },
  ".MuiImageListItemBar-subtitle": {
    color: theme.palette.grey[300],
  },
}));

export interface GalleryGridProps {
  photos: Photo[];
  viewMode: "grid" | "list";
  onPhotoClick: (photo: Photo) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  viewMode,
  onPhotoClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const getImageListCols = () => {
    if (viewMode === "list") return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 4;
    return 3;
  };

  const getImageUrl = (photo: Photo): string => {
    if (!photo.url) return PLACEHOLDER_IMAGE;
    if (photo.url.startsWith("http")) return photo.url;

    // Ensure URL is properly formatted
    const cleanUrl = photo.url.startsWith("/") ? photo.url : `/${photo.url}`;
    return `${BACKEND_URL}${cleanUrl}`;
  };

  const handleImageLoad = (photoId: string) => {
    setLoadedImages((prev) => ({ ...prev, [photoId]: true }));
    console.log("Image loaded successfully:", photoId);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    photo: Photo
  ) => {
    console.error(`Failed to load image: ${photo.url}`);
    const imgElement = e.currentTarget;
    if (!loadedImages[photo.id]) {
      console.log("Setting placeholder for:", photo.id);
      imgElement.src = PLACEHOLDER_IMAGE;
      setLoadedImages((prev) => ({ ...prev, [photo.id]: true }));
    }
  };

  return (
    <ImageList
      cols={getImageListCols()}
      gap={24}
      sx={{
        m: 0,
        ".MuiImageListItem-root": {
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "grey.700",
        },
      }}
      variant={viewMode === "list" ? "quilted" : "standard"}
      rowHeight={viewMode === "list" ? 200 : 340}
    >
      {photos.map((photo) => (
        <StyledImageListItem key={photo.id} onClick={() => onPhotoClick(photo)}>
          {!loadedImages[photo.id] && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={viewMode === "list" ? 200 : 340}
              animation="wave"
            />
          )}
          <img
            src={getImageUrl(photo)}
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
          <ImageListItemBar
            title={photo.location}
            subtitle={
              <Box
                component="span"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{photo.userName}</span>
                <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
              </Box>
            }
            actionIcon={
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${photo.location}`}
              >
                <LocationOn />
              </IconButton>
            }
          />
        </StyledImageListItem>
      ))}
    </ImageList>
  );
};

export default GalleryGrid;
