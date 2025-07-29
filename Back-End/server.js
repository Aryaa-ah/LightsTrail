// Back-End/server.js - Minimal Production Version
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./service/app.js";
import initScheduler from './service/scheduler.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3002;
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

// Simple MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB Database");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize scheduler after DB connection
    initScheduler();
    console.log("✅ Scheduler initialized");
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 LightsTrail API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV === 'production') {
        console.log("🌐 Production URL: https://lightstrail.onrender.com");
      }
    });
    
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();