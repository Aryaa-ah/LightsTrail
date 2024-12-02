// src/features/gallery/components/GalleryCard.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Chip,
  // styled,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
  Share,
  Lock,
  MoreVert,
  LocationOn,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Photo } from "../types/gallery.types";
// import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.2)}`,
    borderColor: theme.palette.primary.main,
    "& .image-overlay": {
      opacity: 1,
    },
  },
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  paddingTop: "75%", // 4:3 aspect ratio
  overflow: "hidden",
}));

const StyledImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s ease",
});

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to top,
    ${alpha(theme.palette.background.default, 0.9)} 0%,
    ${alpha(theme.palette.background.default, 0.5)} 50%,
    ${alpha(theme.palette.background.default, 0.2)} 100%)`,
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
}));

interface GalleryCardProps {
  photo: Photo;
  onDelete?: (id: string) => void;
  onEdit?: (photo: Photo) => void;
  onLike?: (id: string) => void;
  onPhotoClick?: (photo: Photo) => void;
  showActions?: boolean;
}
const GalleryCard: React.FC<GalleryCardProps> = ({
  photo,
  onDelete,
  onEdit,
  onLike,
  onPhotoClick,
  showActions = true,
}) => {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) onLike(photo.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aurora photo from ${photo.location}`,
          text: photo.description || "Check out this aurora photo!",
          url: window.location.origin + `/gallery/${photo.id}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard onClick={() => onPhotoClick?.(photo)}>
        <ImageContainer>
          <StyledImage
            src={photo.url}
            alt={`Aurora at ${photo.location}`}
            loading="lazy"
          />
          <ImageOverlay className="image-overlay">
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6" color="common.white">
                {photo.location}
              </Typography>
              {showActions && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title={isLiked ? "Unlike" : "Like"}>
                    <IconButton
                      size="small"
                      onClick={handleLike}
                      sx={{
                        color: isLiked ? "error.main" : "common.white",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      {isLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  {typeof navigator.share === "function" && (
                    <Tooltip title="Share">
                      <IconButton
                        size="small"
                        onClick={handleShare}
                        sx={{ color: "common.white" }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{ color: "common.white" }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              )}
            </Box>
          </ImageOverlay>

          {photo.visibility === "private" && (
            <Chip
              icon={<Lock sx={{ fontSize: 16 }} />}
              label="Private"
              size="small"
              sx={{
                position: "absolute",
                top: theme.spacing(2),
                right: theme.spacing(2),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(4px)",
              }}
            />
          )}
        </ImageContainer>

        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
              }}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${photo.userName}`}
            >
              {photo.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {photo.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(photo.createdAt), "MMMM dd, yyyy")}
              </Typography>
            </Box>
          </Box>

          {photo.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
              }}
            >
              {photo.description}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {photo.location}
            </Typography>
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEdit?.(photo);
            }}
          >
            <Edit sx={{ mr: 1, fontSize: 20 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              if (
                window.confirm("Are you sure you want to delete this photo?")
              ) {
                onDelete?.(photo.id);
              }
            }}
            sx={{ color: "error.main" }}
          >
            <Delete sx={{ mr: 1, fontSize: 20 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            {photo.visibility === "private" ? (
              <>
                <Visibility sx={{ mr: 1, fontSize: 20 }} />
                Make Public
              </>
            ) : (
              <>
                <VisibilityOff sx={{ mr: 1, fontSize: 20 }} />
                Make Private
              </>
            )}
          </MenuItem>
        </Menu>
      </StyledCard>
    </motion.div>
  );
};

export default GalleryCard;
