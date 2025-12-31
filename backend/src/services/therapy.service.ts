import mongoose from 'mongoose';
import TherapyAssignment, { ITherapyAssignment } from '../models/therapyAssignment.model';
import User from '../models/user.model';
import { AssignTherapyInput } from '../schemas/therapy.schema';
import TherapySession, { ITherapySession } from '../models/therapySession.model';
import { LogSessionInput } from '../schemas/therapy.schema';

export const assignTherapy = async (
  doctorId: string, 
  payload: AssignTherapyInput
) => {
  const { patientId, gameId, gameName, settings, clinicalNote } = payload;

  
  const patient = await User.findOne({ 
    _id: patientId, 
    assignedDoctor: doctorId 
  });

  if (!patient) {
    throw new Error("Access Denied: This patient is not assigned to you.");
  }

  await TherapyAssignment.updateMany(
    { 
      patientId, 
      gameId, 
      isActive: true 
    },
    { 
      isActive: false 
    }
  );

  const newAssignment = await TherapyAssignment.create({
    patientId,
    doctorId,
    gameId,
    gameName,
    settings, 
    clinicalNote,
    isActive: true
  });

  return newAssignment;
};

export const logSessionResult = async (
  patientId: string, 
  input: LogSessionInput
) => {
  
  const session = await TherapySession.create({
    patientId, // From auth context (controller)
    assignmentId: input.assignmentId,
    gameId: input.gameId,
    gameName: input.gameName,
    
    startTime: new Date(input.startTime),
    endTime: new Date(input.endTime),
    durationSeconds: input.durationSeconds,
    
    score: input.score,
    accuracy: input.accuracy,
    status: input.status,
    
    performanceData: input.performanceData || {}
  });

  return session;
};

export const getActiveTherapyPlan = async (patientId: string) => {

  const plan = await TherapyAssignment.find({ 
    patientId, 
    isActive: true 
  })
  .select('-__v -updatedAt') 
  .sort({ createdAt: -1 })
  .populate('doctorId', 'name email speciality');

  return plan;
};


export const getPatientHistory = async (patientId: string) => {
    return await TherapySession.find({ patientId })
        .sort({ createdAt: 1 }) // Oldest first (better for line charts)
        .limit(30); // Last 30 sessions
};