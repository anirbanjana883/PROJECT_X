import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/userModel.js'; 

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: "Not authorized, no token" 
      });
    }

    // 1. Decode token to get User ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. FETCH FRESH USER DATA FROM DB (The Fix)
    // This ensures that if you change the role in Mongo manually, the server sees it immediately!
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not found" });
    }

    // 3. Attach full user object (including role) to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      message: "Not authorized, token failed" 
    });
  }
};