import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        message: "Not authorized, no token" 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request (so controller can access req.user.userId)
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      message: "Not authorized, token failed" 
    });
  }
};