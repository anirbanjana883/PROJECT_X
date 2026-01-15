import { z } from "zod";

export const PeripheralDefenderSchema = z.object({
  // Central Task (Keep foveal vision busy)
  centralTaskEnabled: z.boolean().default(true),
  centralTaskDifficulty: z.enum(["easy", "hard"]).default("easy"),
  
  // Peripheral Stimuli
  stimulusSize: z.number().min(1).max(10).default(5),
  fieldOfView: z.number().min(10).max(100).default(40), // Degrees of spread
  speed: z.number().min(1).max(10).default(5),
  
  // Medical
  quadrantRestriction: z.enum(["none", "left", "right", "upper", "lower"]).default("none"), // Restrict to specific field
});

export const defaultPeripheralDefender = PeripheralDefenderSchema.parse({});