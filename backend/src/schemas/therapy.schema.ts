import { object, string, number, boolean, date, TypeOf, z } from "zod";

// Reusable ObjectId validator
const objectId = string().trim().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// --- 1. ASSIGNMENT SCHEMA (Doctor Prescribing) ---
export const assignTherapySchema = object({
  body: object({
    patientId: objectId, // Must be a valid User ID
    
    gameId: string().trim().min(1, "Game ID is required"), 
    gameName: string().trim().min(1, "Game Name is required"),

    settings: object({
      duration: number().min(60).max(3600),
      size: number().min(1).max(10),
      speed: number().min(1).max(10),
      
      contrast: number().min(0).max(100), 
      
      colorCombination: z.enum(["red-green", "red-blue", "blue-green", "none"]),
      backgroundColor: z.enum(["black", "white", "green", "blue"]),
      targetType: z.enum([
        "dot", "number", "letter", "toy", "smiley", "sad", "animal",
      ]),

      depthEnabled: boolean().default(false),
      dichopticEnabled: boolean().default(false),
    }).strict(),

    clinicalNote: string().trim().optional(),
  }).strict(),
});

export type AssignTherapyInput = TypeOf<typeof assignTherapySchema>["body"];


// --- 2. LOGGING SCHEMA (Patient Saving Results) ---
export const logSessionSchema = object({
  body: object({
    // Links back to the specific prescription (Optional, in case of free-play)
    assignmentId: objectId.optional(),
    
    gameId: string().trim().min(1, "Game ID is required"),
    gameName: string().trim().min(1, "Game Name is required"),
    
    // Expect ISO Date strings from frontend (e.g. "2023-10-05T14:48:00.000Z")
    startTime: string().datetime({ message: "Invalid ISO start time" }),
    endTime: string().datetime({ message: "Invalid ISO end time" }),
    
    durationSeconds: number().min(0),
    
    score: number().default(0),
    accuracy: number().min(0).max(100),
    
    status: z.enum(['completed', 'aborted', 'failed']),
    
    // Flexible object for game-specific metrics (e.g. { "clicks": 50, "velocity": 12.5 })
    performanceData: z.record(z.string(), z.any()).optional(),
  }).strict(),
});

export type LogSessionInput = TypeOf<typeof logSessionSchema>["body"];