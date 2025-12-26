import mongoose from 'mongoose';
import TherapyAssignment, { ITherapyAssignment } from '../models/therapyAssignment.model';
import User from '../models/user.model';
import { AssignTherapyInput } from '../schemas/therapy.schema';


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


export const getActiveTherapyPlan = async (patientId: string) => {

  const plan = await TherapyAssignment.find({ 
    patientId, 
    isActive: true 
  })
  .select('-__v -updatedAt') 
  .sort({ createdAt: -1 });

  return plan;
};