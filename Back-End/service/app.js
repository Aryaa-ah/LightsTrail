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
      // Production domains
      "https://lightstrail.live",
      "https://www.lightstrail.live",
      "https://api.lightstrail.live",
      
      // Render deployment URLs (update frontend URL when deployed)
      "https://lightstrail.onrender.com",
      "https://lightstrail-frontend.onrender.com",
      
      // Development
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3002",
      
      // Environment variable for flexibility
      process.env.CLIENT_URL
    ].filter(Boolean); // Remove any undefined values
    
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Trust proxy - important for Render
app.set('trust proxy', 1);

// ============ HEALTH CHECK ROUTES ============
// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LightsTrail API is running',
    version: '1.0.0',
    domain: 'lightstrail.live',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      api: '/api',
      glossary: '/api/glossary',
      email: '/api/email',
      uploads: '/uploads'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    service: 'LightsTrail Backend',
    domain: 'lightstrail.live',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage()
    }
  };
  
  // Return 200 if healthy, 503 if unhealthy
  const httpStatus = mongoose.connection.readyState === 1 ? 200 : 503;
  res.status(httpStatus).json(healthCheck);
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'LightsTrail API v1.0',
    description: 'Northern Lights tracking and tourism guide API',
    documentation: 'https://lightstrail.live/docs',
    baseEndpoints: [
      { method: 'GET', path: '/', description: 'API status' },
      { method: 'GET', path: '/health', description: 'Health check' },
      { method: 'GET', path: '/api', description: 'API information' }
    ],
    apiEndpoints: [
      '/api/glossary',
      '/api/email',
      '/api/users',
      '/api/auth',
      '/api/galleries',
      '/api/aurora-forecasts',
      '/api/alerts'
    ]
  });
});

// ============ END HEALTH CHECK ROUTES ============

// ============ SEO ROUTES ============
// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lightstrail.live/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lightstrail.live/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://lightstrail.live/gallery</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://lightstrail.live/aurora-forecast</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://lightstrail.live/glossary</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://lightstrail.live/tourism-guide</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
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
Disallow: /profile
Disallow: /api/

# Allow search engines to access public API documentation
Allow: /api/docs`);
});

// ============ END SEO ROUTES ============

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// File access middleware
app.use("/uploads", (req, res, next) => {
  const filePath = path.join(uploadsDir, path.basename(req.url));
  
  if (fs.existsSync(filePath)) {
    next();
  } else {
    res.status(404).json({ 
      success: false,
      error: "File not found" 
    });
  }
});

// API Routes
app.use("/api/glossary", glossaryRoutes);
app.use("/api/email", tourismRouter);
app.use("/api/alerts", alertRouter);

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Passport initialization
app.use(passport.initialize());

// Initialize other routes
initializeRouter(app);

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: ['/health', '/api', '/api/glossary', '/api/email', '/api/alerts']
  });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error("App Error:", err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    success: false,
    error: isDevelopment ? err.message : "Internal Server Error",
    ...(isDevelopment && { stack: err.stack })
  });
});

// IMPORTANT: Only export the app - NO server startup here!
export default app;