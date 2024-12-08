// Back-End/service/app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import initializeRouter from "./routers/index.js";
import fs from "fs";
import passport from './middleware/passport-config.js';
import glossaryRoutes from "./routers/glossaryRouter.js";
import alertRouter from './routers/alertRouter.js';
import tourismRouter from "./routers/tourismGuideRouter.js";


// import initScheduler from './service/scheduler.js';


// ES module fixes for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create uploads directory path
const uploadsDir = path.join(__dirname, "uploads"); 

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

app.use("/uploads", (req, res, next) => {
  const filePath = path.join(uploadsDir, path.basename(req.url));
  console.log(`Accessing file: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    console.log("File exists, proceeding to next middleware");
    next();
  } else {
    console.log("File not found:", filePath);
    res.status(404).json({ 
      success: false,
      error: "File not found" 
    });
  }
});
app.use("/api/glossary", glossaryRoutes);

app.use("/api/email", tourismRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(passport.initialize());
// Initialize routes
initializeRouter(app);


app.use((err, req, res, next) => {
  console.error("App Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

export default app;

