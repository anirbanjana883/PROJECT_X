import mongoose from 'mongoose';
import TherapyAssignment from '../models/therapyAssignment.model'; // Must have 'config' field
import User from '../models/user.model';
import { AssignTherapyInput, LogSessionInput } from '../schemas/therapy.schema'; // Must have 'specificConfig'
import TherapySession from '../models/therapySession.model';
import { getValidatorForGame } from '../protocols/registry'; // Must exist

// --- 1. ASSIGN THERAPY (Doctor Prescribing) ---
export const assignTherapy = async (
  doctorId: string, 
  payload: AssignTherapyInput
) => {
  const { patientId, gameId, gameName, duration, specificConfig, clinicalNote } = payload;

  const patient = await User.findOne({ _id: patientId, assignedDoctor: doctorId });
  if (!patient) {
    throw new Error("Access Denied: This patient is not assigned to you.");
  }

  const gameSchema = getValidatorForGame(gameId);
  const validatedConfig = gameSchema.parse(specificConfig || {});

  await TherapyAssignment.updateMany(
    { patientId, gameId, isActive: true },
    { isActive: false }
  );

  const newAssignment = await TherapyAssignment.create({
    patientId: new mongoose.Types.ObjectId(patientId),
    doctorId: new mongoose.Types.ObjectId(doctorId),
    
    gameId,
    gameName,
    duration: duration || 300,

    config: validatedConfig as Record<string, any>, 
    
    clinicalNote,
    isActive: true
  });

  return newAssignment;
};
// --- 2. LOG SESSION (Patient Playing) ---
export const logSessionResult = async (
  patientId: string, 
  input: LogSessionInput
) => {
  const session = await TherapySession.create({
    patientId, 
    assignmentId: input.assignmentId, 
    gameId: input.gameId,
    gameName: input.gameName,
    
    startTime: new Date(input.startTime),
    endTime: new Date(input.endTime),
    durationSeconds: input.durationSeconds,
    
    score: input.score,
    accuracy: input.accuracy,
    status: input.status,
    
    // Flexible metrics (e.g. { "clicks": 40, "averageSpeed": 2.5 })
    performanceData: input.performanceData || {}
  });

  return session;
};

// --- 3. GET ACTIVE PLAN (Patient Dashboard) ---
export const getActiveTherapyPlan = async (patientId: string) => {
  const plan = await TherapyAssignment.find({ 
    patientId, 
    isActive: true 
  })
  .select('-__v -updatedAt') 
  .sort({ createdAt: -1 })
  .populate('doctorId', 'name email');

  return plan;
};

// --- 4. GET HISTORY (Patient Profile) ---
export const getPatientHistory = async (patientId: string) => {
    return await TherapySession.find({ patientId })
        .sort({ createdAt: -1 }) // Newest first (Standard for history logs)
        .limit(50); 
};