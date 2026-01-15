import { z } from "zod";

export const MemoryMatrixSchema = z.object({
  // Grid Configuration
  gridSize: z.number().min(3).max(10).default(4), // 3x3 up to 10x10
  numberOfTiles: z.number().min(3).max(20).default(5), // How many tiles to remember
  
  // Timing
  displayTime: z.number().min(0.5).max(10).default(2), // Seconds to show pattern
  
  // Difficulty
  distractionTiles: z.boolean().default(false), // Show fake tiles?
  reverseRecall: z.boolean().default(false), // Click in reverse order?
});

export const defaultMemoryMatrix = MemoryMatrixSchema.parse({});