import jwt from 'jsonwebtoken';

// export const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }
//         req.user = user;
//         next();
//     });
// };

// auth.js
export const authenticateToken = (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      console.log('Auth Header:', authHeader);
      console.log('Token:', token);
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.error('Token verification error:', err);
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
          });
        }
  
        console.log('Verified user:', user);
        req.user = user;
        next();
      });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }
  };