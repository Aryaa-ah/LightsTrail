// service/controllers/galleryController.js
import Gallery from "../models/gallery.js";
import galleryService from "../services/galleryServices.js";

const galleryController = {
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const photo = new Gallery({
        url: `/uploads/${req.file.filename}`,
        userName: req.body.userName || "Anonymous",
        userId: req.body.userId || "testuser123",
        location: req.body.location,
        fileName: req.file.filename,
        visibility: "public",
        likes: 0,
        createdAt: new Date().toISOString(),
      });

      const savedPhoto = await photo.save();

      // Return the full URL in the response
      res.status(201).json({
        success: true,
        data: {
          id: savedPhoto._id,
          url: savedPhoto.url,
          userName: savedPhoto.userName,
          location: savedPhoto.location,
          createdAt: savedPhoto.createdAt,
          visibility: savedPhoto.visibility,
          likes: savedPhoto.likes,
        },
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  getPhotos: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const photos = await Gallery.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Gallery.countDocuments();

      const transformedPhotos = photos.map((photo) => ({
        id: photo._id,
        url: photo.url, // This will be the relative path starting with /uploads/
        userName: photo.userName,
        location: photo.location,
        createdAt: photo.createdAt,
        visibility: photo.visibility,
        likes: photo.likes,
      }));
      res.status(200).json({
        success: true,
        data: photos,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPhotos: total,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  getPhotoById: async (req, res) => {
    try {
      const photo = await Gallery.findById(req.params.photoId);

      if (!photo) {
        return res.status(404).json({
          success: false,
          error: "Photo not found",
        });
      }

      res.status(200).json({
        success: true,
        data: photo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  updatePhoto: async (req, res) => {
    try {
      console.log("Update request:", {
        id: req.params.photoId,
        updates: req.body,
      });

      const photo = await Gallery.findById(req.params.photoId);
      if (!photo) {
        return res.status(404).json({
          success: false,
          error: "Photo not found",
        });
      }

      console.log("Found photo:", photo);

      Object.assign(photo, req.body);
      await photo.save();

      console.log("Updated photo:", photo);

      return res.status(200).json({
        success: true,
        data: photo,
      });
    } catch (error) {
      console.error("Update failed:", error);
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  deletePhoto: async (req, res) => {
    try {
      const photo = await Gallery.findByIdAndDelete(req.params.photoId);

      if (!photo) {
        return res.status(404).json({
          success: false,
          error: "Photo not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Photo deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
};

export default galleryController;
