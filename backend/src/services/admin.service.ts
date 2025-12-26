import User from '../models/user.model';
import { DoctorRequestInput } from '../schemas/auth.schema';

// 1. USER: Apply for Doctor Access
export const applyForDoctor = async (userId: string, data: DoctorRequestInput) => {
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    
    if (user.role === 'doctor') {
        throw new Error('User is already a doctor');
    }
    
    if (user.verificationStatus === 'pending') {
        throw new Error('Application already pending');
    }

    // Update status and save details
    user.verificationStatus = 'pending';
    user.doctorDetails = {
        licenseNumber: data.licenseNumber,
        specialization: data.specialization
    };

    await user.save();
    return user;
};

// 2. ADMIN: Approve a Doctor
export const approveDoctorAccess = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    if (user.verificationStatus !== 'pending') {
        throw new Error('User has not applied for doctor access');
    }

    user.role = 'doctor';
    user.verificationStatus = 'approved';
    
    await user.save();
    return user;
};

// 3. ADMIN: Get All Users (for the Dashboard)
export const getAllUsers = async () => {
    return await User.find().select('-password').sort({ createdAt: -1 });
};