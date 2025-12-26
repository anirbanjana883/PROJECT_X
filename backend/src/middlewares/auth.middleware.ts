import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// custom interface
interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}

//  The "Bouncer" - Checks if you are logged in
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check Cookies 
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token found, kick them out
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        // Find User in DB 
        const user = await User.findById(decoded.userId).select('-password'); 
        
        if (!user) {
             return res.status(401).json({ success: false, message: 'User not found' });
        }

        // E. Attach user to the request object 
        (req as any).user = user;
        
        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

//  ADMIN ONLY: check ofr admin badge
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }
};

// Factory Function: Allow specific roles (e.g., 'doctor', 'admin')
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes((req as any).user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: You do not have permission to perform this action." 
      });
    }
    next();
  };
};