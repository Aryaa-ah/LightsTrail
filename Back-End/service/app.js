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

// Database connection - FIXED
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.MONGO_CONNECTION;
    
    if (!mongoUrl) {
      console.error('❌ MongoDB connection string not found!');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
      throw new Error('MONGO_URL or MONGODB_URI environment variable is required');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    
    // Remove deprecated options that cause warnings
    await mongoose.connect(mongoUrl);
    
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Don't exit in production, let the app run without DB for now
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Routes
initializeRouter(app);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/alerts', alertRouter);
app.use('/api/tourism', tourismRouter);

// Health check endpoint - ENHANCED
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
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

// Server startup - IMPROVED
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('🔄 Please kill the existing process or use a different port');
  } else {
    console.error('❌ Server error:', err);
  }
});

export default app;