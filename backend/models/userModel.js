import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
// We don't need the JWT method here anymore,
// as it's handled by the external genToken.js

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    // --- ADDED FROM RANBHOOMI ---
    username: {
        type: String,
        unique: true,
        // This will be set by the 'generateUsername' function
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
        // Not required, because of Google Auth
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'], // Your roles for IndriyaX
        default: 'patient'
    },
    
    // --- FIELDS FOR PASSWORD RESET (from Ranbhoomi) ---
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
    },
    
    // --- Doctor-Specific ---
    clinicName: {
        type: String,
        trim: true
    },
    
}, { timestamps: true });

// --- Mongoose Methods (Helpers) ---
// We keep the 'comparePassword' method from our original plan,
// but the 'signup' code handles hashing manually, which is also fine.
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;