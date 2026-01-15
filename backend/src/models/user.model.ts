import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// 1. FIX: Added 'doctorDetails' back to the Interface so admin.service doesn't crash
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "patient" | "doctor" | "admin";

  assignedDoctor?: mongoose.Types.ObjectId | null;
  medicalCondition?: string;
  severity?: "low" | "medium" | "high";
  intakeStatus?: "pending" | "assigned" | "discharged";
  verificationStatus: "idle" | "pending" | "approved" | "rejected";

  doctorDetails?: {
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
    googleId: { type: String, unique: true, sparse: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    medicalCondition: { type: String, default: "General Checkup" },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    intakeStatus: { type: String, enum: ["pending", "assigned", "discharged"], default: "pending" },
    verificationStatus: { type: String, enum: ["idle", "pending", "approved", "rejected"], default: "idle" },
    
    doctorDetails: {
      licenseNumber: { type: String },
      specialization: { type: String },
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;