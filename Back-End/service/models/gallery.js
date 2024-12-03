// Back-End/service/models/gallery.js
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create and export model
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
