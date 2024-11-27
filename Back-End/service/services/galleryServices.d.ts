import {
  Photo,
  FetchPhotosParams,
  FetchPhotosResponse,
} from "../../../app/src/types/gallery.types";

declare class GalleryService {
  createPhoto(
    photoData: Partial<Photo>,
    file: Express.Multer.File
  ): Promise<Photo>;
  getPhotos(page?: number, limit?: number): Promise<FetchPhotosResponse>;
  getPhotoById(photoId: string): Promise<Photo>;
  updatePhoto(photoId: string, updateData: Partial<Photo>): Promise<Photo>;
  deletePhoto(photoId: string): Promise<boolean>;
  searchPhotosByLocation(
    location: string,
    page?: number,
    limit?: number
  ): Promise<FetchPhotosResponse>;
  toggleLike(photoId: string): Promise<Photo>;
}

declare const galleryService: GalleryService;
export default galleryService;
