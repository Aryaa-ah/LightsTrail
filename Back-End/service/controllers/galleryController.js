// service/controllers/galleryController.js
import Gallery from "../models/gallery.js";
import galleryService from "../services/galleryServices.js";

const galleryController = {
  uploadPhoto: async (req, res) => {
    try {
      // 1. Validate file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      // 2. Validate required fields
      if (!req.body.userName || !req.body.location) {
        return res.status(400).json({
          success: false,
          error: "userName and location are required",
        });
      }

      // 3. Create new photo document
      const photo = new Gallery({
        url: req.file.path, // Use full path
        userName: req.body.userName,
        location: req.body.location,
        description: req.body.description || "",
        fileName: req.file.filename,
      });

      // 4. Save to database
      const savedPhoto = await photo.save();

      // 5. Send response
      return res.status(201).json({
        success: true,
        data: savedPhoto,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      return res.status(400).json({
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
