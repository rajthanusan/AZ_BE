// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modles/user'); // Ensure the correct path to the User model
const { sendRegistrationEmail } = require('../services/emailService');

// Secret key for JWT signing
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable or default value

// Generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        secretKey,
        { expiresIn: '1h' }
    );
};

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    try {
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ firstName, lastName, email, password: hashedPassword, role: 'user' });
      await newUser.save();
  
      // Send registration email
      await sendRegistrationEmail(email, firstName);
      
      // Send welcome email
      
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };


// Register a new admin
const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
      if (!firstName, !lastName, !email, !password) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new User({ firstName, lastName, email, password: hashedPassword, role: 'admin' });
      await newAdmin.save();

      res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// User login route
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email, !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Admin Dashboard Route
const adminDashboard = (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard' });
};

// User Dashboard Route
const userDashboard = (req, res) => {
    res.json({ message: 'Welcome to the user dashboard' });
};

module.exports = {
    registerUser,
    registerAdmin,
    login,
    adminDashboard,
    userDashboard
};

// // authController.js
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../modles/user'); // Ensure the correct path to the User model
// const { sendRegistrationEmail } = require('../services/emailService');

// // Secret key for JWT signing
// const secretKey = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable or default value

// // Generate a JWT token
// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user._id, role: user.role },
//         secretKey,
//         { expiresIn: '1h' }
//     );
// };

// // Register a new user
// const registerUser = async (req, res) => {
//     const { firstName, lastName, email, password, phoneNumber } = req.body;
  
//     try {
//       if (!firstName || !lastName || !email || !password || !phoneNumber) {
//         return res.status(400).json({ message: 'All fields are required' });
//       }
  
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword,
//         phoneNumber,
//         role: 'user'
//       });
//       await newUser.save();
  
//       // Send registration email
//       await sendRegistrationEmail(email, firstName);
  
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error registering user', error: error.message });
//     }
//   };

// // Register a new admin
// const registerAdmin = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   try {
//       if (!firstName, !lastName, !email, !password) {
//           return res.status(400).json({ message: 'All fields are required' });
//       }

//       const existingAdmin = await User.findOne({ email });
//       if (existingAdmin) {
//           return res.status(400).json({ message: 'Admin already exists' });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newAdmin = new User({ firstName, lastName, email, password: hashedPassword, role: 'admin' });
//       await newAdmin.save();

//       res.status(201).json({ message: 'Admin registered successfully' });
//   } catch (error) {
//       res.status(500).json({ message: 'Error registering admin', error: error.message });
//   }
// };

// // User login route
// const login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         if (!email, !password) {
//             return res.status(400).json({ message: 'Email and password are required' });
//         }

//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = generateToken(user);
//         res.json({
//             success: true,
//             message: 'Login successful',
//             token,
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 role: user.role,
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// };

// // Admin Dashboard Route
// const adminDashboard = (req, res) => {
//     res.json({ message: 'Welcome to the admin dashboard' });
// };

// // User Dashboard Route
// const userDashboard = (req, res) => {
//     res.json({ message: 'Welcome to the user dashboard' });
// };

// module.exports = {
//     registerUser,
//     registerAdmin,
//     login,
//     adminDashboard,
//     userDashboard
// };



