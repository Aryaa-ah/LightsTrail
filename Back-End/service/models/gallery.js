// Back-End/service/models/gallery.js
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    userId: {
      type: String,
      ref: "User",
      required: false, // change later.
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likes: {
      type: Number,
      default: 0,
    },
    metadata: {
      camera: String,
      settings: {
        iso: Number,
        exposure: String,
        aperture: String,
      },
    },
  },
  {
    timestamps: true,
    collection: "gallery",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gallerySchema.virtual("fullUrl").get(function () {
  return `/uploads/${this.fileName}`;
});

gallerySchema.index({ userName: 1 });
gallerySchema.index({ location: 1 });
gallerySchema.index({ createdAt: -1 });

gallerySchema.pre("save", function (next) {
  console.log("Saving gallery item:", this);
  next();
});

gallerySchema.post("save", function (doc) {
  console.log("Saved gallery item:", doc);
});

const Gallery = mongoose.model("Gallery", gallerySchema, "gallery");
export default Gallery;
