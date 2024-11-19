// service/services/galleryServices.js
import Gallery from "../models/gallery.js";

class GalleryService {
  async createPhoto(photoData, file) {
    try {
      // Create new photo document
      const photo = new gallery({
        url: file.path, // Save the file path
        userName: photoData.userName,
        location: photoData.location,

        fileName: file.filename, // Save the filename
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
      // Ensure positive integers
      page = Math.max(1, parseInt(page));
      limit = Math.max(1, Math.min(20, parseInt(limit)));

      const skip = (page - 1) * limit;

      // Execute query with pagination
      const [photos, total] = await Promise.all([
        gallery
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-__v"),
        gallery.countDocuments(),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        photos,
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
      const photo = await gallery.findById(photoId).select("-__v");

      if (!photo) {
        throw new Error("Photo not found");
      }

      return photo;
    } catch (error) {
      throw new Error(`Error fetching photo: ${error.message}`);
    }
  }

  async updatePhoto(photoId, updateData) {
    try {
      const photo = await gallery
        .findByIdAndUpdate(
          photoId,
          { $set: updateData },
          {
            new: true, // Return updated document
            runValidators: true, // Run schema validators
          }
        )
        .select("-__v");

      if (!photo) {
        throw new Error("Photo not found");
      }

      return photo;
    } catch (error) {
      throw new Error(`Error updating photo: ${error.message}`);
    }
  }

  async deletePhoto(photoId) {
    try {
      const photo = await gallery.findById(photoId);

      if (!photo) {
        throw new Error("Photo not found");
      }

      // Delete from database
      await gallery.findByIdAndDelete(photoId);

      // Optional: Add file deletion logic here
      // await fs.unlink(photo.url);

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
        gallery
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select("-__v"),
        gallery.countDocuments(query),
      ]);

      return {
        photos,
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
}

export default new GalleryService();
