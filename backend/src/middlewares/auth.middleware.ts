import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Custom interface for the token payload
interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}

//  PROTECT
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const user = await User.findById(decoded.userId).select('-password'); 
        
        if (!user) {
             return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Attach user to request
        (req as any).user = user;
        
        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// AUTHORIZE
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const user = (req as any).user;

    // Check if user exists (set by protect) AND if their role is allowed
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access Denied: Role '${user?.role}' is not authorized to access this route.` 
      });
    }
    
    next();
  };
};

// ADMIN ONLY 
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }
};