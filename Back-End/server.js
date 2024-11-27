import dotenv from 'dotenv';
import express from 'express';
import initialize from "./service/app.js";
// Back-End/service/server.js
import app from "./service/app.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Database");

    // List all collections to verify
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    // Check if 'gallery' collection exists
    const hasGalleryCollection = collections.some((c) => c.name === "gallery");
    console.log("Gallery collection exists:", hasGalleryCollection);
    console.log("Current database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
