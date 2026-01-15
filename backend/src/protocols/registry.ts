import { SpacePursuitsSchema, defaultSpacePursuits } from "./spacePursuits.schema";
import { MemoryMatrixSchema, defaultMemoryMatrix } from "./memoryMatrix.schema";
import { EagleEyeSchema, defaultEagleEye } from "./eagleEye.schema";
import { PeripheralDefenderSchema, defaultPeripheralDefender } from "./peripheralDefender.schema";
import { JungleJumpSchema, defaultJungleJump } from "./jungleJump.schema";
import { ZodSchema } from "zod";

// Valid Game IDs
export type GameId = 
  | "space-pursuits" 
  | "memory-matrix" 
  | "eagle-eye" 
  | "peripheral-defender" 
  | "jungle-jump";

interface ProtocolDefinition {
  name: string;
  schema: ZodSchema;
  defaults: Record<string, any>;
}

export const ProtocolRegistry: Record<string, ProtocolDefinition> = {
  "space-pursuits": {
    name: "Space Pursuits",
    schema: SpacePursuitsSchema,
    defaults: defaultSpacePursuits
  },
  "memory-matrix": {
    name: "Memory Matrix",
    schema: MemoryMatrixSchema,
    defaults: defaultMemoryMatrix
  },
  "eagle-eye": {
    name: "Eagle Eye",
    schema: EagleEyeSchema,
    defaults: defaultEagleEye
  },
  "peripheral-defender": {
    name: "Peripheral Defender",
    schema: PeripheralDefenderSchema,
    defaults: defaultPeripheralDefender
  },
  "jungle-jump": {
    name: "Jungle Jump",
    schema: JungleJumpSchema,
    defaults: defaultJungleJump
  }
};

export const getValidatorForGame = (gameId: string) => {
  const protocol = ProtocolRegistry[gameId];
  if (!protocol) {
    throw new Error(`Game Protocol '${gameId}' not found in registry.`);
  }
  return protocol.schema;
};