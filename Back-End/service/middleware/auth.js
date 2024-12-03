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

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided',
            statusCode: 401
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                statusCode: 401
            });
        }
        req.user = user;
        next();
    });
};