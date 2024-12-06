// service/routers/galleryRouter.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import galleryController from '../controllers/galleryController.js';

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Store in uploads directory
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Basic validation middleware
const validatePhotoId = (req, res, next) => {
    const photoId = req.params.photoId;
    if (!photoId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid photo ID format'
        });
    }
    next();
};

// Routes




router.post('/photos', 
    upload.single('image'), 
    galleryController.uploadPhoto
);

router.get('/photos',
    galleryController.getPhotos
);
//location before photosId works
router.get('/photos/search', galleryController.searchPhotos);

router.get('/photos/:photoId',
    validatePhotoId,
    galleryController.getPhotoById
);





router.put('/photos/:photoId',
    validatePhotoId,
    galleryController.updatePhoto
);



router.delete('/photos/:photoId',
    validatePhotoId,
    galleryController.deletePhoto
);


router.get('/search', galleryController.searchPhotos);


// Error handling middleware
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File size cannot exceed 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }

    // Handle other errors
    console.error('Router Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

export default router;