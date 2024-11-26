// service/services/galleryServices.js
import Gallery from "../models/gallery.js";

class GalleryService {
  async createPhoto(photoData, file) {
    try {
      // Create new photo document
      const photo = new Gallery({
        // Changed from 'gallery' to 'Gallery'
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
      return {
        ...photo.toObject(), // Convert to plain object
        id: photo._id,
        url: `/uploads/${file.filename}`,
      };
    } catch (error) {
      throw new Error(`Error creating photo: ${error.message}`);
    }
  }

  async getPhotos(page = 1, limit = 10) {
    try {
      console.log("Starting getPhotos...", { page, limit });
      console.log("Gallery model:", Gallery);

      if (!Gallery || typeof Gallery.find !== "function") {
        throw new Error("Gallery model is not properly initialized");
      }

      // Ensure positive integers
      page = Math.max(1, parseInt(page));
      limit = Math.max(1, Math.min(20, parseInt(limit)));

      const skip = (page - 1) * limit;

      const [photos, total] = await Promise.all([
        Gallery.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .lean(),
        Gallery.countDocuments(),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      // Format URLs for frontend
      const formattedPhotos = photos.map((photo) => ({
        ...photo,
        id: photo._id.toString(),
        url: `/uploads/${photo.fileName}`, // Ensure URL is properly formatted
      }));

      return {
        photos: formattedPhotos,
        pagination: {
          currentPage: page,
          limit,
          totalPhotos: total,
          totalPages,
          hasNext,
          hasPrev,
        },
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
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPhotos: total,
          limit,
        },
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
