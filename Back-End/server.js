// Back-End/server.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./service/app.js";
import initScheduler from './service/scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 3002;
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

// MongoDB connection with error handling 
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Database");

    // Verify connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );
    
    // Verify Gallery model
    const Gallery = mongoose.model("Gallery");
    if (!Gallery) {
      throw new Error("Gallery model not initialized");
    }
    
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

// Start server with async DB connection
const startServer = async () => {
  try {
    await connectDB();

    initScheduler();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

export { connectDB };
