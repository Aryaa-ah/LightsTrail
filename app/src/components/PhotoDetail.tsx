import React from "react";
import type { Photo } from '../types/gallery.types';


type PhotoDetailProps = {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (photo: Photo) => void;
  userOnly?: boolean;
};

const PhotoDetail: React.FC<PhotoDetailProps> = () => {
  return <div></div>;
};

export default PhotoDetail;
