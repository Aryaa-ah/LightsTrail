/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  
} from "@mui/material";
import { Search, Camera, GridView, LocationOn } from "@mui/icons-material";
import { List as ListIcon } from "lucide-react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/index";
import type { Photo as GalleryPhoto } from "../types/gallery.types";
import { AppDispatch } from "../store";
import { useTranslation } from 'react-i18next';

// Custom Components
import GalleryGrid from "../components/GalleryGrid";
import PhotoUpload from "../components/PhotoUpload";
import ErrorState from "../../../app/src/components/errorState";
import PhotoDetail from "../components/PhotoDetail";
import EmptyState from "../../../app/src/components/EmptyState";
import { Photo } from "../types/gallery.types";

// Redux Actions
import {
  fetchPhotos,
  setSelectedPhoto,
  updateFilters,
  uploadPhoto,
  updatePhoto,
  getPhotoById,
  searchPhotosByLocation,
} from "../store/gallerySlice";

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const controlsVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: 0.2,
    },
  },
};


interface EditPhotoData {
  location?: string;
  description?: string;
}

interface GalleryPageProps {
  userOnly?: boolean;
}


interface SearchResult {
  success: boolean;
  data: Photo[];
}


const GalleryPage: React.FC<GalleryPageProps> = ({ userOnly = false }) => {
  
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {
    photos = [],
    loading = false,
    error,
    filters,
  } = useSelector((state: RootState) => state.gallery);

  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        setIsSearching(true);
        if (!query.trim()) {
          await dispatch(fetchPhotos({ userOnly })).unwrap();
        } else {
          await dispatch(searchPhotosByLocation(query)).unwrap();
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [dispatch, userOnly]
  );
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Fetch all photos when search is cleared
      dispatch(fetchPhotos({ userOnly }));
    }
  }, [searchQuery, dispatch, userOnly]);

  // Add cleanup
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Loading state effect
  useEffect(() => {
    if (loading) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [loading]);

  // const handleSearchChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const query = e.target.value;
  //     setSearchQuery(query);

  //     try {
  //       if (!query.trim()) {
  //         // Immediately clear search and show all photos
  //         dispatch(fetchPhotos({ userOnly }));
  //       } else {
  //         debouncedSearch(query);
  //       }
  //     } catch (error) {
  //       console.error("Search error:", error);
  //     }
  //   },
  //   [debouncedSearch, dispatch, userOnly]
  // );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      
      try {
        // Always use debouncedSearch - it will handle empty queries correctly
        debouncedSearch(query);
      } catch (error) {
        console.error("Search error:", error);
      }
    },
    [debouncedSearch]
  );

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPhoto, setSelectedPhotoState] = useState<GalleryPhoto | null>(
    null
  );
  
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Load initial photos
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

  const handleUpdatePhoto = async (photoId: string, updates: EditPhotoData) => {
    try {
      await dispatch(updatePhoto({ photoId, updates })).unwrap();
      await dispatch(fetchPhotos({ userOnly }));
      const updatedPhoto = await dispatch(getPhotoById(photoId)).unwrap();
      setSelectedPhotoState(updatedPhoto);
      setEditingPhoto(null);
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
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
        {/* Header Section */}
        <motion.div variants={contentVariants}>
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
                {t(userOnly ? 'gallery.title.personal' : 'gallery.title.main')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
            {t(userOnly ? 'gallery.subtitle.personal' : 'gallery.subtitle.main')}
            </Typography>
          </Box>
        </motion.div>

        {/* Controls Section */}
        <motion.div variants={controlsVariants}>
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
                placeholder={t('gallery.actions.search')}
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  maxWidth: { md: 400 },
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  borderRadius: 2,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: isSearching ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={() => setViewMode("grid")}
                    color={viewMode === "grid" ? "primary" : "default"}
                  >
                    <GridView />
                  </IconButton>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={() => setViewMode("list")}
                    color={viewMode === "list" ? "primary" : "default"}
                  >
                    <ListIcon />
                  </IconButton>
                </motion.div>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Camera />}
                  onClick={() => setUploadModalOpen(true)}
                  sx={{
                    fontSize: 18,
                    background:
                      "linear-gradient(45deg, #84fab0 0%, #8fd3f4 100%)",
                    boxShadow: theme.shadows[4],
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #84fab0 20%, #8fd3f4 100%)",
                    },
                  }}
                >
                  {t('gallery.actions.upload')}
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {(filters.location || filters.dateRange) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState
                error={error}
                onRetry={() => dispatch(fetchPhotos({ userOnly }))}
              />
            </motion.div>
          ) : !photos.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState onUpload={() => setUploadModalOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <GalleryGrid
                photos={photos}
                viewMode={viewMode}
                onPhotoClick={handlePhotoClick}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Photo Dialog */}
        <Dialog
          open={!!editingPhoto}
          onClose={() => setEditingPhoto(null)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Fade}
        >
          <DialogTitle>{t('gallery.photo.edit')}</DialogTitle>          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                fullWidth
                label={t('gallery.photo.location')}
                defaultValue={editingPhoto?.location}
                onChange={(e) => {
                  if (editingPhoto) {
                    setEditingPhoto({
                      ...editingPhoto,
                      location: e.target.value,
                    });
                  }
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('gallery.photo.description')}
                defaultValue={editingPhoto?.description}
                onChange={(e) => {
                  if (editingPhoto) {
                    setEditingPhoto({
                      ...editingPhoto,
                      description: e.target.value,
                    });
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setEditingPhoto(null)}>  {t('gallery.photo.cancel')}</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  if (editingPhoto) {
                    handleUpdatePhoto(editingPhoto.id, {
                      location: editingPhoto.location,
                      description: editingPhoto.description,
                    });
                  }
                }}
                variant="contained"
              >
                 {t('gallery.photo.save')}
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        <AnimatePresence>
          <PhotoUpload
            isOpen={isUploadModalOpen}
            onClose={() => setUploadModalOpen(false)}
            onUpload={handlePhotoUpload}
            onUploadSuccess={() => {
              setUploadModalOpen(false);
              dispatch(fetchPhotos({ userOnly }));
            }}
          />
        </AnimatePresence>

        <AnimatePresence>
          {selectedPhoto && (
            <PhotoDetail
              photo={selectedPhoto}
              isOpen={!!selectedPhoto}
              onClose={() => setSelectedPhotoState(null)}
              onPhotoDeleted={() => {
                dispatch(fetchPhotos({ userOnly }));
              }}
              onUpdatePhoto={async (photoId, updates) => {
                try {
                  await dispatch(updatePhoto({ photoId, updates })).unwrap();
                  await dispatch(fetchPhotos({ userOnly }));
                  const updatedPhoto = await dispatch(
                    getPhotoById(photoId)
                  ).unwrap();
                  setSelectedPhotoState(updatedPhoto);
                } catch (error) {
                  console.error("Error updating photo:", error);
                }
              }}
            />
          )}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default GalleryPage;
