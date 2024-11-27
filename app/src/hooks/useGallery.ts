 import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/store";
import { fetchPhotos } from "../store/gallerySlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useGallery = () => {
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const { photos, loading, error, filters } = useSelector(
    (state: RootState) => state.gallery
  );

  useEffect(() => {
    dispatch(fetchPhotos({ page: 1, limit: 12 }));
  }, [dispatch, filters]);

  return {
    photos,
    loading,
    error,
  };
};
