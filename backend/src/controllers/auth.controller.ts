import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, validatePassword, findUserById, getPendingPatients, assignPatientToDoctor, getDoctorRoster } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// --- HELPER FUNCTIONS ---

// 1. Exported Sign Token (Used by Login, Register, AND Google Auth)
export const signToken = (id: string, role: string) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d', 
  });
};

// 2. Send Cookie Helper
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

// --- CONTROLLERS ---

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

// 3. GOOGLE CALLBACK (New)
export const googleCallbackHandler = (req: Request, res: Response) => {
  // User is already attached to req by Passport
  const user = (req as any).user;
  
  // Generate the same token we use for standard login
  const token = signToken(user._id, user.role);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  // Set Cookie
  res.cookie('token', token, options);

  // Redirect to Frontend Dashboard based on Role
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const targetPath = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
  
  res.redirect(`${frontendUrl}${targetPath}`);
};

// 4. LOGOUT
export const logoutHandler = (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    expires: new Date(Date.now()), 
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'User logged out' });
};

// 5. GET ME
export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id; 
        const user = await findUserById(userId);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// --- DOCTOR SPECIFIC CONTROLLERS ---

export const getMyPatientsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = (req as any).user._id;
    const patients = await getDoctorRoster(doctorId);
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
};

export const getIntakeQueueHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await getPendingPatients();
    res.status(200).json({ success: true, count: queue.length, data: queue });
  } catch (error) {
    next(error);
  }
};


export const claimPatientHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = (req as any).user._id;
    const { patientId } = req.body;
    const updatedPatient = await assignPatientToDoctor(patientId, doctorId);
    
    res.status(200).json({
      success: true,
      message: `Success! You are now treating ${updatedPatient.name}.`,
      data: updatedPatient
    });
  } catch (error: any) {
    if (error.message === 'Patient not found') return res.status(404).json({ success: false, message: error.message });
    if (error.message === 'Patient already claimed by another doctor') return res.status(409).json({ success: false, message: error.message });
    next(error);
  }
};