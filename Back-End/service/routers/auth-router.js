// import express from 'express';
// import * as authController from './../controllers/auth-controller.js';
// import { verifyToken } from './../services/auth-service.js';

// const router = express.Router();

// // Public routes
// router.route('/signup').post(authController.signup);
// router.route('/login').post(authController.login);

// // Example of a protected route
// router.route('/profile')
//     .get(verifyToken, (req, res) => {
//         // This route requires a valid JWT token
//         res.json({ message: 'Access to protected route', user: req.user });
//     });

// export default router;



import express from 'express';
import * as authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', authController.signup); // User signup
router.post('/login', authController.login);   // User login

export default router;