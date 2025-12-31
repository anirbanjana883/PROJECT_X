import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, validatePassword, findUserById } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import User from '../models/user.model';

//  Sign JWT Token 
const signToken = (id: string, role: string) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d', 
  });
};

//  Send Cookie & Response 
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id, user.role);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus
    },
  });
};


// 1. REGISTER
export const registerHandler = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);
    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    if (error.message === 'Email already exists') {
        return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// 2. LOGIN
export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// 3. LOGOUT
export const logoutHandler = (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    expires: new Date(Date.now()), 
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'User logged out' });
};

// 4. GET CURRENT USER (Me)
export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
        const userId = (req as any).user._id; 
        const user = await findUserById(userId);
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const getMyPatientsHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // 1. Get the logged-in Doctor's ID
    const doctorId = (req as any).user._id;

    // 2. Find Users who have this doctor assigned
    const patients = await User.find({ 
        assignedDoctor: doctorId,
        role: 'patient' // Optional safety check
    })
    .select('-password -__v') // Don't send passwords
    .sort({ createdAt: -1 });

    // 3. Send Response
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });

  } catch (error) {
    next(error);
  }
};