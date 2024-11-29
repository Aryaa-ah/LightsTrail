import React from "react";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";

// Styled components remain the same
const StyledImageListItem = styled(ImageListItem)(({ theme }) => ({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  "& img": {
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover img": {
    transform: "scale(1.05)",
  },
  "&:hover .MuiImageListItemBar-root": {
    opacity: 1,
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

  const getImageListCols = () => {
    if (viewMode === "list") return 1;
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 4;
    return 3;
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
          bgcolor: "grey.800",
          border: "1px solid",
          borderColor: "grey.700",
        },
      }}
      variant={viewMode === "list" ? "quilted" : "standard"}
      rowHeight={viewMode === "list" ? 200 : 340}
    >
      {photos.map((photo) => (
        <StyledImageListItem
          key={photo.id}
          onClick={() => onPhotoClick(photo)}
          cols={viewMode === "list" ? 2 : 1}
          rows={viewMode === "list" ? 1 : undefined}
        >
          <img
            src={photo.url}
            alt={`Aurora at ${photo.location}`}
            loading="lazy"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
          <StyledImageListItemBar
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