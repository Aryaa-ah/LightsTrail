// src/features/gallery/components/GalleryGrid.tsx
import { useState } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Camera, GridView, ViewList, LocationOn } from "@mui/icons-material";
import PhotoUpload from "./PhotoUpload";
import { styled } from "@mui/material/styles";
import { Photo } from "../types/gallery.types";

// Styled components
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
  setViewMode: (mode: "grid" | "list") => void;
  onPhotoClick: (photo: Photo) => void;
  userOnly?: boolean;
  setPhotos?: (photos: Photo[]) => void;
  isUserGallery?: boolean;
  loading?: boolean;
  error?: string | null;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  photos,
  viewMode,
  setViewMode,
  onPhotoClick,
  setPhotos,
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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

  const handleUpload = async (photo: Photo) => {
    try {
      const formData = new FormData();
      formData.append('image', photo.url);
      formData.append('location', photo.location);
      formData.append('userName', photo.userName);

      const response = await fetch('/api/gallery/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      const newPhoto = {
        ...result.data,
        url: `${window.location.origin}${result.data.url}`,
      };

      if (setPhotos) {
        setPhotos([newPhoto, ...photos]);
      }
      setIsUploadOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "list" | null
  ) => {
    if (newMode !== null && setViewMode) {
      setViewMode(newMode);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: "100vh", bgcolor: "grey.900" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "white", fontWeight: "bold" }}
        >
          Aurora Gallery
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              bgcolor: "grey.800",
              "& .MuiToggleButton-root": {
                color: "grey.400",
                "&.Mui-selected": {
                  bgcolor: "grey.700",
                  color: "white",
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Camera />}
            onClick={() => setIsUploadOpen(true)}
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Upload
          </Button>
        </Box>
      </Box>

      {/* Gallery using ImageList */}
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

      {/* Upload Modal */}
      <PhotoUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </Container>
  );
};

export default GalleryGrid;
