// service/controllers/galleryController.js
import Gallery from "../models/gallery.js";
import galleryService from "../services/galleryServices.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const galleryController = {
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Ensure file was saved correctly
      const filePath = path.join(uploadsDir, req.file.filename);

      // Copy file to uploads directory if it's not there
      if (!fs.existsSync(filePath) && req.file.path) {
        fs.copyFileSync(req.file.path, filePath);
      }

      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: "File upload failed" });
      }

      const serverUrl = `${req.protocol}://${req.get("host")}`;
      const photo = new Gallery({
        fileName: req.file.filename,
        url: `/uploads/${req.file.filename}`, // Keep URL relative
        userName: req.body.userName || "Anonymous",
        location: req.body.location,
        visibility: "public",
        likes: 0,
      });

      const savedPhoto = await photo.save();

      // Return absolute URL in response
      res.status(201).json({
        success: true,
        data: {
          ...savedPhoto.toObject(),
          url: `${serverUrl}${savedPhoto.url}`,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(400).json({ error: error.message }); // Return error message
    }
  },
  getPhotos: async (req, res) => {
    try {
      const photos = await Gallery.find().sort({ createdAt: -1 });

      const transformedPhotos = photos.map((photo) => {
        const filePath = path.join(uploadsDir, photo.fileName);
        const fileExists = fs.existsSync(filePath);

        if (!fileExists) {
          console.warn(`File not found: ${filePath}`);
        }

        return {
          id: photo._id,
          url: `/uploads/${photo.fileName}`,
          userName: photo.userName,
          location: photo.location,
          createdAt: photo.createdAt,
          fileExists,
        };
      });

      res.status(200).json({ success: true, data: transformedPhotos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
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
      const photo = await Gallery.findById(req.params.photoId);
      
      if (!photo) {
        return res.status(404).json({
          success: false,
          error: "Photo not found"
        });
      }
  
      // Strict ownership check
      if (photo.userName !== req.body.userName || !req.body.userName) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized: You can only delete your own photos"
        });
      }
  
      // Proceed with deletion if authorized
      await Gallery.findByIdAndDelete(req.params.photoId);
  
      res.status(200).json({
        success: true,
        message: "Photo deleted successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },
  
  // searchPhotos: async (req, res) => {
  //   try {
  //     const { location } = req.query;
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 12;
  
  //     let query = {};
  //     if (location) {
  //       query.location = { $regex: new RegExp(location, 'i') };
  //     }
  
  //     const photos = await Gallery.find(query)
  //       .sort({ createdAt: -1 })
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  
  //     const transformedPhotos = photos.map(photo => ({
  //       id: photo._id,
  //       url: `/uploads/${photo.fileName}`,
  //       userName: photo.userName,
  //       location: photo.location,
  //       createdAt: photo.createdAt,
  //     }));
  
  //     res.status(200).json({
  //       success: true,
  //       data: transformedPhotos
  //     });
  //   } catch (error) {
  //     console.error('Search error:', error);
  //     res.status(400).json({
  //       success: false,
  //       error: error.message || 'Failed to search photos'
  //     });
  //   }
  // }

  searchPhotos: async (req, res) => {
    try {
      const { location } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
  
      // If no location query or empty string, return all photos
      const query = location?.trim() 
        ? { location: { $regex: new RegExp(`^${location}`, 'i') } }
        : {};
  
      const photos = await Gallery.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      const transformedPhotos = photos.map(photo => ({
        id: photo._id,
        url: `/uploads/${photo.fileName}`,
        userName: photo.userName,
        location: photo.location,
        createdAt: photo.createdAt,
      }));
  
      res.status(200).json({
        success: true,
        data: transformedPhotos
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to search photos'
      });
    }
  }
    
};


export default galleryController;
