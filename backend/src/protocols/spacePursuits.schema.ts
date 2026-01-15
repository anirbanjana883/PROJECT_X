import { z } from "zod";

export const SpacePursuitsSchema = z.object({
  // Movement Physics
  speed: z.number().min(1).max(20).default(5),
  size: z.number().min(0.5).max(10).default(5),
  
  // Visuals
  contrast: z.number().min(10).max(100).default(100),
  backgroundColor: z.enum(["black", "white", "green", "grey"]).default("black"),
  
  // Medical / Dichoptic
  dichopticEnabled: z.boolean().default(false),
  colorCombination: z.enum(["red-blue", "red-green", "none"]).default("none"),
  
  // Game Specific
  asteroidCount: z.number().min(10).max(100).default(40),
});

export const defaultSpacePursuits = SpacePursuitsSchema.parse({});