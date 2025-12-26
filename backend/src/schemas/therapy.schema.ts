import { object, string, number, boolean, TypeOf, z } from "zod";

// Reusable ObjectId validator (Keep this for Database IDs)
const objectId = string().trim().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const assignTherapySchema = object({
  body: object({
    patientId: objectId, // Must be a valid User ID
    
    // UPDATED: Relaxed validation to allow "g1", "g2" etc.
    gameId: string().trim().min(1, "Game ID is required"), 
    
    gameName: string().trim().min(1, "Game Name is required"),

    settings: object({
      duration: number().min(60).max(3600),
      size: number().min(1).max(10),
      speed: number().min(1).max(10),
      
      // Matches your 0-100 numeric requirement
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