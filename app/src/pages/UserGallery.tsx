import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../src/hooks/useGallery";
import GalleryGrid from "../components/GalleryGrid";
import { fetchPhotos, setSelectedPhoto } from "../store/gallerySlice";
import { RootState } from "../store";
import { CircularProgress } from "@mui/material";
import type { Photo } from "../types/gallery.types";

interface UserGalleryProps {
  userOnly: boolean;
}

const UserGallery: React.FC<UserGalleryProps> = ( ) => {
  const dispatch = useAppDispatch();
  const { photos, loading, error } = useSelector(
    (state: RootState) => state.gallery
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(
      fetchPhotos({
        page: 1,
        limit: 12,
        userOnly: true,
      })
    );
  }, [dispatch]);

  const handleSetPhotos = (newPhotos: Photo[]) => {
    console.log('Photos updated:', newPhotos);
  };

  const handlePhotoClick = (photo: Photo) => {
    dispatch(setSelectedPhoto(photo));
  };

  if (loading && !photos.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">My Photos</h1>
      <GalleryGrid 
        photos={photos}
        setPhotos={handleSetPhotos}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPhotoClick={handlePhotoClick}
        isUserGallery={true}
        userOnly={true}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default UserGallery;
