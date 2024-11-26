// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');

// // const adminAuthMiddleware = async (req, res, next) => {
// //     try {
// //         const token = req.headers.authorization.split(' ')[1];
// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //         const user = await User.findById(decoded.id);
// //         if (!user || user.role !== 'admin') {
// //             return res.status(403).json({ message: 'Access denied' });
// //         }

// //         req.user = user;
// //         next();
// //     } catch (error) {
// //         res.status(401).json({ message: 'Unauthorized' });
// //     }
// // };

// // module.exports = { adminAuthMiddleware };
// // Example of adminAuthMiddleware
// const jwt = require('jsonwebtoken');

// const adminAuthMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         req.user = decoded;
//         next();
//     });
// };
// module.exports = { adminAuthMiddleware };
