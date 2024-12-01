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

// ES module fixes for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3002"],
    credentials: true,
  })
);
app.use('/uploads', express.static(uploadsDir));
 
app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "image/jpg");
    },
  })
);

pp.use("/uploads", (req, res, next) => {
  console.log(`Accessing file: ${req.url}`);
  console.log(`Full path: ${path.join(uploadsDir, req.url)}`);
  const filePath = path.join(uploadsDir, req.url);

  if (fs.existsSync(filePath)) {
    console.log("File exists at path");
  } else {
    console.log("File does not exist at path");
  }
  next();
});

initializeRouter(app);

app.use((err, req, res, next) => {
  console.error("App Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

export default app;
