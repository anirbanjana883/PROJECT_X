import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values to not conflict
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: 6,
        select: false 
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'], 
        default: 'patient'
    },
    
    // --- THIS IS THE CRITICAL FIX ---
    // This field must exist for the Doctor Dashboard to work
    assignedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // --------------------------------

    // --- Doctor Specific ---
    clinicName: {
        type: String,
        trim: true
    },

    // --- Password Reset Fields ---
    resetOtp: {
        type: String,
        default: undefined
    },
    otpExpires: {
        type: Date,
        default: undefined
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// --- Mongoose Methods (Helpers) ---
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if model already exists to prevent overwrite errors in hot-reload
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;