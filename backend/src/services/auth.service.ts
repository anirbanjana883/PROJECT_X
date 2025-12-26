import User, { IUser } from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

// 1. Create a new user
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

// 2. Find user by Email
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// 3. Validate Password
export const validatePassword = async ({ email, password }: LoginInput) => {
  // We need to select '+password' because it is hidden by default in the Model
  const user = await User.findOne({ email }).select('+password');

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return user;
};

// 4. Find User by ID (For 'Get Me')
export const findUserById = async (id: string) => {
    return await User.findById(id).select('-password');
};