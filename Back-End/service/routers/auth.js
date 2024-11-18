import express from "express";
const router = express.Router();
import User from "../models/user.js";
import jwt from "jsonwebtoken";


// Environment variable for JWT secret


router.post('/signup', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  console.log(JWT_SECRET);
  const { firstName, lastName, email, password } = req.body;
  console.log(firstName,lastName,email,password);
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const user = new User({ firstName, lastName, email, password });
   

    // Save the user and await the result
    await user.save();


    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
export default router;