import { z } from "zod";

export const JungleJumpSchema = z.object({
  // Physics
  gameSpeed: z.number().min(1).max(10).default(5),
  gravity: z.enum(["low", "normal", "high"]).default("normal"),
  
  // Obstacles
  obstacleFrequency: z.enum(["low", "medium", "high"]).default("medium"),
  gapSize: z.enum(["wide", "narrow", "random"]).default("wide"),
  
  // Visuals
  highContrastMode: z.boolean().default(false),
});

export const defaultJungleJump = JungleJumpSchema.parse({});