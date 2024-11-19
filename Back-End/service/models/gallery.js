import mongoose from "mongoose";

// Define the schema for gallery items in the application
const gallerySchema = new mongoose.Schema(
  {
    // URL of the stored image
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    // Name of the user who uploaded the image
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    // Geographic location where the image was taken
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    // Original filename of the uploaded image
    fileName: {
      type: String,
      required: true,
      // Example: "photo-1679012345678.jpg"
    },
  },
  // Schema options
  {
    timestamps: true,
    collection: "gallery",
  }
);

gallerySchema.index({ userName: 1 });
gallerySchema.index({ location: 1 });
gallerySchema.index({ createdAt: -1 });

gallerySchema.pre("save", async function (next) {
  console.log("Pre-save document:", this);
  next();
});

// Add post-save middleware for debugging
gallerySchema.post("save", function (doc) {
  console.log("Document saved successfully:", doc.toObject());
});

const Gallery = mongoose.model("Gallery", gallerySchema, 'gallery');
export default Gallery;
