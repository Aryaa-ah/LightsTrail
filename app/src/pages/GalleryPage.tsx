/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Photo } from "../types/gallery.types";

import { useDispatch, useSelector } from "react-redux";
// import { useInView } from "react-intersection-observer";
import { Grid as GridIcon, List as ListIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

// Material UI Components
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  // Dialog,
} from "@mui/material";
import {
  Search,
  Camera,
  Filter,
  GridView,
  // ViewList,
  LocationOn,
} from "@mui/icons-material";
// Custom Components
import GalleryGrid from "../components/GalleryGrid";
import PhotoUpload from "../components/PhotoUpload";
import ErrorState from "../../../app/src/components/errorState";
import PhotoDetail from "../components/PhotoDetail";
// import GalleryFilters from "../components/GalleryFilters";
import EmptyState from "../../../app/src/components/EmptyState";

// State and Types
import {
  fetchPhotos,
  setSelectedPhoto,
  updateFilters,
  uploadPhoto,
} from "../store/gallerySlice";
import type { RootState } from "../store/index";
import type { Photo as GalleryPhoto } from "../types/gallery.types";
import { AppDispatch } from "../store";

import { motion } from "framer-motion";

const GalleryPage: React.FC<{ userOnly?: boolean }> = ({
  userOnly = false,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {
    photos = [],
    loading = false,
    error,
    filters,
  } = useSelector((state: RootState) => state.gallery);

  const dummyPhoto = React.useMemo(
    () => ({
      id: "1",
      url: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938",
      userName: "Demo User",
      location: "Tromsø, Norway",
      createdAt: new Date().toISOString(),
      userId: "dummy-user",
      visibility: "public",
      likes: 42,
      description: "Amazing Northern Lights display over the fjords",
    }),
    []
  );

  // Local state
  const [displayPhotos, setDisplayPhotos] = useState<Photo[]>([]);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPhoto, setSelectedPhotoState] = useState<GalleryPhoto | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadInitialPhotos = async () => {
      try {
        await dispatch(fetchPhotos({ userOnly })).unwrap();
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };
    loadInitialPhotos();
  }, [dispatch, userOnly]);

  // Update display photos when photos change
  useEffect(() => {
    if (photos && photos.length > 0) {
      setDisplayPhotos(photos);
    } else {
      setDisplayPhotos([dummyPhoto]);
    }
  }, [photos, dummyPhoto]);

  // Handle search input
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      debounce(() => {
        dispatch(updateFilters({ searchQuery: query }));
        dispatch(fetchPhotos({ userOnly }));
      }, 500)();
    },
    [dispatch, userOnly]
  );

  const handlePhotoUpload = async (photo: Photo) => {
    try {
      const formData = new FormData();
      formData.append("image", photo as unknown as Blob);
      formData.append("location", photo.location);
      formData.append("userName", photo.userName);

      await dispatch(uploadPhoto(formData)).unwrap();
      await dispatch(fetchPhotos({ userOnly }));
      setUploadModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhotoState(photo);
    dispatch(setSelectedPhoto(photo));
  };

  // Handle upload success
  const handleUploadSuccess = async () => {
    try {
      setUploadModalOpen(false);
      console.log("Refreshing photos after upload");
      await dispatch(fetchPhotos({ page: 1, limit: 12, userOnly }));

      // Log the current state to verify update
      console.log("Photos updated:", photos);
      console.log("Display photos:", displayPhotos);
    } catch (error) {
      console.error("Error refreshing photos:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          p: { xs: 2, sm: 3 },
          mt: { xs: 8, sm: 10 },
          minHeight: "100vh",
          bgcolor: "transparent",
        }}
      >
        {/* Enhanced Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)"
                  : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            {userOnly ? "My Gallery" : "Aurora Gallery"}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {userOnly
              ? "Manage and showcase your aurora captures"
              : "Discover and share stunning aurora captures"}
          </Typography>
        </Box>

        {/* Enhanced Controls Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="medium"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              maxWidth: { md: 400 },
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(8px)",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              ml: { md: "auto" },
              alignItems: "center",
            }}
          >
            {/* View Toggle */}
            <Box
              sx={{
                display: "flex",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: 2,
                p: 0.5,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <IconButton
                onClick={() => setViewMode("grid")}
                color={viewMode === "grid" ? "primary" : "default"}
              >
                <GridView />
              </IconButton>
              <IconButton
                onClick={() => setViewMode("list")}
                color={viewMode === "list" ? "primary" : "default"}
              >
                <ListIcon />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Filter />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.5),
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Filters
            </Button>

            <Button
              variant="contained"
              startIcon={<Camera />}
              onClick={() => setUploadModalOpen(true)}
              sx={{
                background: "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)",
                boxShadow: theme.shadows[4],
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #84fab0 20%, #8fd3f4 100%)",
                },
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>

        {/* Active Filters */}
        {(filters.location || filters.dateRange) && (
          <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
            {filters.location && (
              <Chip
                icon={<LocationOn sx={{ fontSize: 18 }} />}
                label={filters.location}
                onDelete={() => {
                  dispatch(updateFilters({ location: undefined }));
                  dispatch(fetchPhotos({ userOnly }));
                }}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  "& .MuiChip-deleteIcon": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            )}
          </Box>
        )}

        {/* Gallery Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <ErrorState
              error={error}
              onRetry={() => dispatch(fetchPhotos({ userOnly }))}
            />
          ) : !photos.length ? (
            <EmptyState onUpload={() => setUploadModalOpen(true)} />
          ) : (
            <GalleryGrid
              photos={photos}
              viewMode={viewMode}
              onPhotoClick={handlePhotoClick}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
        <PhotoUpload
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handlePhotoUpload}
          onUploadSuccess={() => {
            setUploadModalOpen(false);
            dispatch(fetchPhotos({ userOnly }));
          }}
        />
        <PhotoDetail
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhotoState(null)}
          userOnly={userOnly}
        />
      </Container>
    </motion.div>
  );
};

export default GalleryPage;
