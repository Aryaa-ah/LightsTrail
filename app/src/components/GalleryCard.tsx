// src/features/gallery/components/GalleryCard.tsx
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  //   CardMedia,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  //   Fade,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
  Share,
  //   Public,
  Lock,
  MoreVert,
  LocationOn,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Photo } from "../types/gallery.types";
import { useAuth } from "../hooks/useAuth";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.grey[900],
  borderRadius: theme.spacing(1.5),
  transition: "all 0.3s ease",
  cursor: "pointer",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey[800]}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
    "& .image-overlay": {
      opacity: 1,
    },
  },
}));

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  paddingTop: "75%", // 4:3 aspect ratio
  "&:hover": {
    "& .image-overlay": {
      opacity: 1,
    },
  },
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
  background:
    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
  opacity: 0,
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
}));

const VisibilityBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.grey[900] + "CC",
  backdropFilter: "blur(4px)",
  ".MuiChip-icon": {
    color: theme.palette.grey[300],
  },
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
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOwner = user?.id === photo.userId;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      await onLike(photo.id);
      setIsLiked(!isLiked);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this photo?")
    ) {
      await onDelete(photo.id);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(photo);
    }
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
    <StyledCard onClick={() => onPhotoClick?.(photo)}>
      <ImageContainer>
        <StyledImage
          src={photo.url}
          alt={`Aurora at ${photo.location}`}
          loading="lazy"
        />

        <ImageOverlay className="image-overlay">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocationOn fontSize="small" />
            <Typography variant="subtitle2">{photo.location}</Typography>
          </Box>
        </ImageOverlay>

        {photo.visibility === "private" && (
          <VisibilityBadge
            icon={<Lock fontSize="small" />}
            label="Private"
            size="small"
          />
        )}
      </ImageContainer>

      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(photo.createdAt), "MMM dd, yyyy")}
          </Typography>

          {showActions && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Tooltip title={isLiked ? "Unlike" : "Like"}>
                <IconButton
                  size="small"
                  onClick={handleLike}
                  sx={{
                    color: isLiked ? "error.main" : "text.secondary",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  {isLiked ? (
                    <Favorite fontSize="small" />
                  ) : (
                    <FavoriteBorder fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              {"share" in navigator && (
                <Tooltip title="Share">
                  <IconButton
                    size="small"
                    onClick={handleShare}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <Share fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {isOwner && (
                <>
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    PaperProps={{
                      sx: {
                        bgcolor: "grey.900",
                        border: 1,
                        borderColor: "grey.800",
                      },
                    }}
                  >
                    <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
                      <Edit fontSize="small" />
                      <Typography>Edit</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={handleDelete}
                      sx={{
                        color: "error.main",
                        gap: 1,
                      }}
                    >
                      <Delete fontSize="small" />
                      <Typography>Delete</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {photo.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {photo.userName}
            </Typography>
            {photo.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {photo.description}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default GalleryCard;
