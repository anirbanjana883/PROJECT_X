import { object, string, number, any, TypeOf, boolean, z } from "zod";

// Reusable ObjectId validator
const objectId = string().trim().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ---  ASSIGNMENT SCHEMA ---
export const assignTherapySchema = object({
  body: object({
    patientId: objectId,
    gameId: string().trim().min(1, "Game ID is required"), 
    gameName: string().trim().min(1, "Game Name is required"),
    duration: number().min(60).max(3600).default(300),
    specificConfig: any(), 

    clinicalNote: string().optional(),
  }).strict(),
});

export type AssignTherapyInput = TypeOf<typeof assignTherapySchema>["body"];


// --- LOGGING SCHEMA ---
export const logSessionSchema = object({
  body: object({
    assignmentId: objectId.optional(),
    gameId: string().trim().min(1),
    gameName: string().trim().min(1),
    startTime: string().datetime(),
    endTime: string().datetime(),
    durationSeconds: number().min(0),
    score: number().default(0),
    accuracy: number().min(0).max(100),
    status: z.enum(['completed', 'aborted', 'failed']),
    performanceData: z.record(z.string(), z.any()).optional(),
  }).strict(),
});

export type LogSessionInput = TypeOf<typeof logSessionSchema>["body"];