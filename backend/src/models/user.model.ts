import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  
  // --- NEW SECURITY FIELDS ---
  verificationStatus: 'idle' | 'pending' | 'approved' | 'rejected'; // Tracks the request
  doctorDetails?: { // Only stores info if they apply
      licenseNumber?: string;
      specialization?: string;
  };

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient', // EVERYONE starts here. No exceptions.
    },

    // --- NEW SECURITY FIELDS ---
    verificationStatus: {
        type: String,
        enum: ['idle', 'pending', 'approved', 'rejected'],
        default: 'idle'
    },
    doctorDetails: {
        licenseNumber: { type: String },
        specialization: { type: String }
    }
  },
  { timestamps: true }
);

// ... (Keep the Pre-save hash and Compare Password methods exactly as they were) ...
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return ;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);

});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;