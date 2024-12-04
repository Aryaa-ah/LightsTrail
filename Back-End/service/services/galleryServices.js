// service/services/galleryServices.js
import mongoose from "mongoose";
import Gallery from "../models/gallery.js";

class GalleryService {
  constructor() {
    if (!Gallery) {
      throw new Error("Gallery model not loaded");
    }
  }

  async verifyConnection() {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready");
    }
  }

  async createPhoto(photoData, file) {
    try {
      // Create new photo document
      const photo = new Gallery({
        url: `/uploads/${file.filename}`,
        userName: photoData.userName,
        location: photoData.location,
        fileName: file.filename,
        createdAt: new Date(),
        visibility: "public",
        likes: 0,
      });

      // Save to database
      await photo.save();
      return photo;
    } catch (error) {
      throw new Error(`Error creating photo: ${error.message}`);
    }
  }

  async getPhotos(page = 1, limit = 10) {
    try {
      await this.verifyConnection();

      const skip = (page - 1) * limit;
      const [photos, total] = await Promise.all([
        Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Gallery.countDocuments(),
      ]);

      return {
        photos: photos.map((photo) => ({
          id: photo._id.toString(),
          url: `/uploads/${photo.fileName}`,
          userName: photo.userName,
          location: photo.location,
          createdAt: photo.createdAt,
        })),
      };
    } catch (error) {
      throw new Error(`Error fetching photos: ${error.message}`);
    }
  }

  async getPhotoById(photoId) {
    try {
      const photo = await Gallery.findById(photoId).select("-__v").lean();

      if (!photo) {
        throw new Error("Photo not found");
      }

      // Format URL
      return {
        ...photo,
        url: `/uploads/${photo.fileName}`,
      };
    } catch (error) {
      throw new Error(`Error fetching photo: ${error.message}`);
    }
  }

  async updatePhoto(photoId, updateData) {
    try {
      const photo = await Gallery.findByIdAndUpdate(
        photoId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-__v")
        .lean();

      if (!photo) {
        throw new Error("Photo not found");
      }

      return {
        ...photo,
        url: `/uploads/${photo.fileName}`,
      };
    } catch (error) {
      throw new Error(`Error updating photo: ${error.message}`);
    }
  }

  async deletePhoto(photoId) {
    try {
      const photo = await Gallery.findById(photoId);

      if (!photo) {
        throw new Error("Photo not found");
      }

      // Delete from database
      await Gallery.findByIdAndDelete(photoId);

      return true;
    } catch (error) {
      throw new Error(`Error deleting photo: ${error.message}`);
    }
  }

  async searchPhotosByLocation(location, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const query = {
        location: { $regex: new RegExp(location, "i") },
      };

      const [photos, total] = await Promise.all([
        Gallery.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .lean(),
        Gallery.countDocuments(query),
      ]);

      const formattedPhotos = photos.map((photo) => ({
        ...photo,
        url: `/uploads/${photo.fileName}`,
      }));

      return {
        photos: formattedPhotos,
      };
    } catch (error) {
      throw new Error(`Error searching photos: ${error.message}`);
    }
  }

  async toggleLike(photoId) {
    try {
      const photo = await Gallery.findById(photoId);
      if (!photo) {
        throw new Error("Photo not found");
      }

      photo.likes = (photo.likes || 0) + 1;
      await photo.save();

      return {
        ...photo.toObject(),
        url: `/uploads/${photo.fileName}`,
      };
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }
}

export default new GalleryService();
