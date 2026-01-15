import { z } from "zod";

export const EagleEyeSchema = z.object({
  // Search Field
  targetType: z.enum(["letter", "number", "shape", "gabor"]).default("letter"),
  fieldDensity: z.enum(["low", "medium", "high"]).default("medium"), // How many distractors
  
  // Difficulty
  targetSize: z.number().min(1).max(10).default(5),
  contrast: z.number().min(10).max(100).default(100),
  
  // Timing
  timeLimit: z.number().min(10).max(300).default(60), // Seconds per round
  flashMode: z.boolean().default(false), // Does target appear/disappear?
});

export const defaultEagleEye = EagleEyeSchema.parse({});