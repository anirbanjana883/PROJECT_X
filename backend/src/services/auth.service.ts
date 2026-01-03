import User, { IUser } from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// Create a new user
export const createUser = async (input: RegisterInput) => {
  try {
    const user = await User.create(input);
    return user;
  } catch (error: any) {
    // Duplicate Key Error (MongoDB Code 11000)
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Find user by Email
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// Validate Password
export const validatePassword = async ({ email, password }: LoginInput) => {
  // We need to select '+password' because it is hidden by default in the Model
  const user = await User.findOne({ email }).select('+password');

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return user;
};

// Find User by ID (For 'Get Me')
export const findUserById = async (id: string) => {
    return await User.findById(id).select('-password');
};

/**
 * QUEUE: Fetch all patients waiting for a doctor
 */
export const getPendingPatients = async () => {
  return await User.find({
    role: 'patient',
    assignedDoctor: null,
    intakeStatus: 'pending'
  })
  .select('name email medicalCondition severity createdAt')
  .sort({ createdAt: 1 }); // FIFO
};

/**
 * QUEUE: Assign a patient to a doctor 
 */
export const assignPatientToDoctor = async (patientId: string, doctorId: string) => {
  const patient = await User.findById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  
  if (patient.assignedDoctor) {
    throw new Error('Patient already claimed by another doctor');
  }

  
  patient.assignedDoctor = doctorId as any; 
  patient.intakeStatus = 'assigned';
  
  return await patient.save();
};

/**
 * ROSTER: Fetch patients assigned to a specific doctor
 */
export const getDoctorRoster = async (doctorId: string) => {
  return await User.find({ 
      assignedDoctor: doctorId,
      role: 'patient' 
  })
  .select('-password -__v')
  .sort({ createdAt: -1 });
};