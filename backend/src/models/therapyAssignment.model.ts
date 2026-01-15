import mongoose, { Document, Schema } from 'mongoose';

export interface ITherapyAssignment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  gameId: string;
  gameName: string;
  
  // Universal Settings
  duration: number; // in seconds
  
  // Polymorphic Settings (JSON Object for specific game rules)
  config: Record<string, any>; 
  
  clinicalNote?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const therapyAssignmentSchema = new Schema<ITherapyAssignment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: String, required: true }, 
    gameName: { type: String, required: true },
    duration: { type: Number, default: 300 },
    config: { type: Schema.Types.Mixed, default: {} },
    clinicalNote: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


therapyAssignmentSchema.index(
  { patientId: 1, gameId: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { isActive: true } 
  }
);

const TherapyAssignment = mongoose.model<ITherapyAssignment>('TherapyAssignment', therapyAssignmentSchema);
export default TherapyAssignment;