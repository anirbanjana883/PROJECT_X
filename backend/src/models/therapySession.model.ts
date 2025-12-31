import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITherapySession extends Document {
  patientId: mongoose.Types.ObjectId;
  assignmentId?: mongoose.Types.ObjectId; 
  
  gameId: string;
  gameName: string;
  
  // Standard Metrics (All games must send these)
  startTime: Date;
  endTime: Date;
  durationSeconds: number;
  score: number;
  accuracy: number; // 0-100%
  
  // Flexible Metrics (Game-specific details)
  
  performanceData?: Record<string, any>; 
  
  status: 'completed' | 'aborted' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const therapySessionSchema = new Schema<ITherapySession>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'TherapyAssignment' }, 
    
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    
    durationSeconds: { 
      type: Number, 
      required: true,
      min: [0, "Duration cannot be negative"] 
    },
    
    score: { type: Number, default: 0 },
    
    accuracy: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    },
    
    // Flexible Data: Stores strictly typed JSON for game-specific analytics
    performanceData: { type: Schema.Types.Mixed, default: {} },
    
    status: {
      type: String,
      enum: ['completed', 'aborted', 'failed'],
      default: 'completed'
    }
  },
  { timestamps: true }
);

// Performance Index: Quickly retrieve history for the Patient Dashboard
therapySessionSchema.index({ patientId: 1, createdAt: -1 });

const TherapySession: Model<ITherapySession> = mongoose.model<ITherapySession>('TherapySession', therapySessionSchema);

export default TherapySession;