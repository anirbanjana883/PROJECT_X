import mongoose, { Document, Schema, Model } from 'mongoose';

export interface GameSettings {
  duration: number;
  size: number;
  speed: number;

  contrast: number; 
  
  colorCombination: 'red-green' | 'red-blue' | 'blue-green' | 'none';
  backgroundColor: 'black' | 'white' | 'green' | 'blue';
  targetType: 'dot' | 'number' | 'letter' | 'toy' | 'smiley' | 'sad' | 'animal';
  
  depthEnabled: boolean;
  dichopticEnabled: boolean;
}

export interface ITherapyAssignment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  gameId: string;
  gameName: string;
  settings: GameSettings;
  clinicalNote?: string;
  isActive: boolean;
}

const therapyAssignmentSchema = new Schema<ITherapyAssignment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameId: { type: String, required: true }, 
    gameName: { type: String, required: true },
    
    settings: {
      duration: { type: Number, default: 300 },
      size: { type: Number, min: 1, max: 10, default: 5 },
      speed: { type: Number, min: 1, max: 10, default: 5 },
      
      // UPDATED: Changed from String Enum to Number Range
      contrast: { type: Number, min: 0, max: 100, default: 100 },
      
      colorCombination: { 
          type: String, 
          enum: ['red-green', 'red-blue', 'blue-green', 'none'], 
          default: 'none' 
      },
      backgroundColor: { 
          type: String, 
          enum: ['black', 'white', 'green', 'blue'], 
          default: 'black' 
      },
      targetType: { 
          type: String, 
          enum: ['dot', 'number', 'letter', 'toy', 'smiley', 'sad', 'animal'], 
          default: 'dot' 
      },
      depthEnabled: { type: Boolean, default: false },
      dichopticEnabled: { type: Boolean, default: false },
    },
    
    clinicalNote: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// unique assignment for 
therapyAssignmentSchema.index(
  { patientId: 1, gameId: 1 }, 
  { unique: true, partialFilterExpression: { isActive: true } }
);

const TherapyAssignment = mongoose.model<ITherapyAssignment>('TherapyAssignment', therapyAssignmentSchema);
export default TherapyAssignment;