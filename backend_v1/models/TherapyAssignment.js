import mongoose from 'mongoose';

const therapyAssignmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: String, 
      required: true,
    },
    // The "Manual Control Panel" Settings
    settings: {
      duration: { type: Number, default: 300 }, 
      difficulty: { type: String, enum: ["easy", "medium", "hard", "custom"], default: "medium" },
      
      // Universal Sliders (1-10 scale)
      speed: { type: Number, default: 5 }, 
      targetSize: { type: Number, default: 5 }, 
      
      // 3D / Dichoptic Specifics
      depthEnabled: { type: Boolean, default: false }, // For 3D
      dichopticEnabled: { type: Boolean, default: false }, // For Red/Blue glasses
      colorFilter: { type: String, enum: ["none", "red-cyan", "green-magenta"], default: "none" },
    },
    clinicalNote: {
      type: String,
      default: "Initial assignment",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure a patient has only ONE active setting per game
therapyAssignmentSchema.index({ patientId: 1, gameId: 1, isActive: 1 }, { unique: true });

const TherapyAssignment = mongoose.model("TherapyAssignment", therapyAssignmentSchema);
export default TherapyAssignment;