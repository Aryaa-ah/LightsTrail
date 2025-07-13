// Back-End/server.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./service/app.js";
import initScheduler from './service/scheduler.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3002;
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

// MongoDB connection with error handling 
const connectDB = async () => {
  try {
    // Note: useNewUrlParser and useUnifiedTopology are deprecated in newer versions
    // but keeping them for compatibility. They can be removed in MongoDB driver 5.0+
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("Connected to MongoDB Database");

    // Verify connection in production
    if (process.env.NODE_ENV === 'production') {
      const adminDb = mongoose.connection.db.admin();
      const info = await adminDb.serverStatus();
      console.log(`MongoDB version: ${info.version}`);
    }

    // Verify collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );
    
    // Verify critical models
    try {
      const Gallery = mongoose.model("Gallery");
      const User = mongoose.model("User");
      console.log("Critical models verified ✓");
    } catch (modelError) {
      console.error("Model initialization error:", modelError.message);
    }
    
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nGracefully shutting down...");
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

// Start server with async DB connection
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize scheduler after DB connection
    initScheduler();
    console.log("Scheduler initialized ✓");
    
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║      LightsTrail API Server            ║
╠════════════════════════════════════════╣
║  Status: RUNNING ✓                     ║
║  Port: ${PORT}                            ║
║  Domain: lightstrail.live              ║
║  Environment: ${process.env.NODE_ENV || 'development'}         ║
╚════════════════════════════════════════╝
      `);
      
      if (process.env.NODE_ENV === 'production') {
        console.log("🌐 Production URLs:");
        console.log("   - https://lightstrail.live");
        console.log("   - https://api.lightstrail.live");
        console.log("   - https://lightstrail.onrender.com");
      } else {
        console.log("🔧 Development URL: http://localhost:" + PORT);
      }
    });
    
    // Handle server errors
    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export for testing or other modules
export { connectDB };