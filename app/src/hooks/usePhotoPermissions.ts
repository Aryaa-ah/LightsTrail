import { useMemo } from 'react';
import { authService } from '../services/auth';
import { Photo } from '../types/gallery.types';

export const usePhotoPermissions = (photo: Photo) => {
  const currentUser = authService.getCurrentUser();

  return useMemo(() => ({
    canModify: () => {
      if (!currentUser) return false;
      const userName = `${currentUser.firstName} ${currentUser.lastName}`;
      return photo.userName === userName;
    },
    isLoggedIn: !!currentUser,
  }), [photo, currentUser]);
};