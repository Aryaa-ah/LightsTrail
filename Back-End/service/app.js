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

// CORS middleware - PRODUCTION READY
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://lightstrail.live',
      'https://www.lightstrail.live'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, '..', '..', 'app', 'public', 'sitemap.xml');
  
  if (fs.existsSync(sitemapPath)) {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(sitemapPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Sitemap not found'
    });
  }
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: https://lightstrail.live/sitemap.xml

# Disallow private/auth pages from search engines
Disallow: /auth/
Disallow: /my-gallery
Disallow: /profile`);
});

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
initializeRouter(app);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/alerts', alertRouter);
app.use('/api/tourism', tourismRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.log("404 - Route not found:", req.path);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;