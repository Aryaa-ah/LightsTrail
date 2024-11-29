import React, { useState, useEffect, useCallback } from "react";
import { Photo } from "../types/gallery.types";

import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import {
  Camera,
  Filter,
  Grid as GridIcon,
  List as ListIcon,
  Search,
  MapPin,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

// Material UI Components
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Box, Typography, Chip } from "@mui/material";

// Custom Components
import GalleryGrid from "../components/GalleryGrid";
import PhotoUpload from "../components/PhotoUpload";
import ErrorState from "../../../app/src/components/errorState";
import PhotoDetail from "../components/PhotoDetail";
import GalleryFilters from "../components/GalleryFilters";
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
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { photos, loading, error, currentPage, totalPages, filters } =
    useSelector((state: RootState) => state.gallery);

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

  // Infinite scroll setup
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Load more photos when scrolling
  useEffect(() => {
    try {
      if (inView && !loading && currentPage < totalPages) {
        dispatch(
          fetchPhotos({
            page: currentPage + 1,
            limit: 12,
            userOnly: userOnly,
          })
        );
      }
    } catch (error) {
      console.error("Error loading more photos:", error);
    }
  }, [inView, loading, currentPage, totalPages, dispatch, userOnly]);

  useEffect(() => {
    // If there are uploaded photos, use them; otherwise, use mock photos
    if (photos && photos.length > 0) {
      setDisplayPhotos(photos);
    } else {
      setDisplayPhotos([dummyPhoto]);
    }
  }, [photos, dummyPhoto]);

  if (loading && !displayPhotos.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  // Debounced search handler
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const debouncedSearch = useCallback(
    (query: string) => {
      debounce(() => {
        dispatch(updateFilters({ searchQuery: query }));
        dispatch(
          fetchPhotos({
            page: 1,
            limit: 12,
            userOnly,
          })
        );
      }, 500)();
    },
    [dispatch, userOnly]
  );

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle photo selection for detail view

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhotoState(photo);
    dispatch(setSelectedPhoto(photo));
  };

  const handlePhotoUpload = async (photo: Photo) => {
    try {
      // Create FormData from the photo
      const file = photo instanceof File ? photo : null;
      if (!file) {
        throw new Error("Invalid file data");
      }
      const formData = new FormData();
      formData.append("image", file);
      formData.append("location", photo.location);
      formData.append("userName", photo.userName);

      await dispatch(uploadPhoto(formData)).unwrap();
      handleUploadSuccess();
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 },
          mt: { xs: 8, sm: 10 }, // Add top margin to create space below the navbar
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {userOnly ? "My Gallery" : "Aurora Gallery"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userOnly
                ? "Manage and showcase your aurora captures"
                : "Discover and share stunning aurora captures"}
            </Typography>
          </Box>

          {/* Controls Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
            }}
          >
            {/* Search */}
            <TextField
              fullWidth
              size="small"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                maxWidth: { md: 300 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {/* View Toggle */}
              <Box
                sx={{
                  display: "flex",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  p: 0.5,
                }}
              >
                <IconButton
                  onClick={() => setViewMode("grid")}
                  color={viewMode === "grid" ? "primary" : "default"}
                >
                  <GridIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode("list")}
                  color={viewMode === "list" ? "primary" : "default"}
                >
                  <ListIcon />
                </IconButton>
              </Box>

              {/* Filter & Upload Buttons */}
              <Button
                variant="outlined"
                startIcon={<Filter />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  borderColor: "divider",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<Camera />}
                onClick={() => setUploadModalOpen(true)}
              >
                Upload
              </Button>
            </Box>
          </Box>

          {/* Active Filters */}
          {(filters.location ||
            filters.sortBy !== "latest" ||
            filters.dateRange) && (
            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
              {filters.location && (
                <Chip
                  icon={
                    <Box sx={{ fontSize: 18 }}>
                      <MapPin size={18} color="currentColor" strokeWidth={2} />
                    </Box>
                  }
                  label={filters.location}
                  onDelete={() => {
                    dispatch(updateFilters({ location: undefined }));
                    dispatch(fetchPhotos({ page: 1, limit: 12, userOnly }));
                  }}
                  sx={{
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {loading && !displayPhotos.length ? (
            <div>Loading...</div>
          ) : error ? (
            <ErrorState
              error={error}
              onRetry={() =>
                dispatch(fetchPhotos({ page: 1, limit: 12, userOnly }))
              }
            />
          ) : displayPhotos.length === 0 ? (
            <EmptyState onUpload={() => setUploadModalOpen(true)} />
          ) : (
            <GalleryGrid
              photos={displayPhotos}
              viewMode={viewMode}
              // setViewMode={setViewMode}
              onPhotoClick={handlePhotoClick}
              // userOnly={userOnly}
            />
          )}
        </AnimatePresence>

        {/* Infinite Scroll & Loading */}
        {!loading && currentPage < totalPages && (
          <div ref={loadMoreRef} style={{ height: 40 }} />
        )}
        {loading && photos.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Modals */}
        <PhotoUpload
          isOpen={isUploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handlePhotoUpload}
          onUploadSuccess={handleUploadSuccess}
        />
        <PhotoDetail
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhotoState(null)}
          userOnly={userOnly}
        />
        <GalleryFilters
          isOpen={isFilterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        />
      </Box>
    </motion.div>
  );
};

export default GalleryPage;
