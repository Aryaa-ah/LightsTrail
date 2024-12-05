// src/features/gallery/components/GalleryCard.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
  Share,
  MoreVert,
  Download,
  CalendarToday,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Photo } from "../types/gallery.types";
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
    "& .image-overlay": {
      opacity: 1,
    },
    "& .card-actions": {
      transform: "translateY(0)",
      opacity: 1,
    },
    "& img": {
      transform: "scale(1.05)",
    },
  },
}));

const ImageContainer = styled(Box)({
  position: "relative",
  paddingTop: "75%",
  overflow: "hidden",
});

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
    ${alpha(theme.palette.background.default, 0.95)} 0%,
    ${alpha(theme.palette.background.default, 0.6)} 50%,
    ${alpha(theme.palette.background.default, 0.3)} 100%)`,
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
}));

const CardActions = styled(Box)(({ theme }) => ({
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

          <CardActions className="card-actions">
            {showActions && (
              <>
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <IconButton
                    size="small"
                    onClick={handleLike}
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                      },
                      color: isLiked ? "error.main" : "inherit",
                    }}
                  >
                    {isLiked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add download logic here
                    }}
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                      },
                    }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>

                {typeof navigator.share === "function" && (
                  <Tooltip title="Share">
                    <IconButton
                      size="small"
                      onClick={handleShare}
                      sx={{
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: "blur(4px)",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.background.paper, 0.9),
                        },
                      }}
                    >
                      <Share />
                    </IconButton>
                  </Tooltip>
                )}

                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                    },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </>
            )}
          </CardActions>

          <ImageOverlay className="image-overlay">
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" color="common.white" gutterBottom>
                {photo.location}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${photo.userName}&backgroundColor=random`}
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
                  <Typography
                    variant="caption"
                    color={alpha(theme.palette.common.white, 0.7)}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <CalendarToday sx={{ fontSize: 12 }} />
                    {format(new Date(photo.createdAt), "MMM dd, yyyy")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ImageOverlay>
        </ImageContainer>

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
          <MenuItem onClick={handleMenuClose}></MenuItem>
        </Menu>
      </StyledCard>
    </motion.div>
  );
};

export default GalleryCard;
