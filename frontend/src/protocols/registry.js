import SpacePursuits from './neuro-ophthalmology/SpacePursuits';
import MemoryMatrix from './cognitive/MemoryMatrix';
import EagleEye from './vision/EagleEye';
import PeripheralDefender from './vision/PeripheralDefender';
import JungleJump from './saccadic/JungleJump';

export const ProtocolRegistry = {
  "space-pursuits": {
    id: "space-pursuits",
    name: "Space Pursuits",
    component: SpacePursuits,
    category: "Neuro-Ophthalmology",
    description: "Trains smooth pursuit capabilities using depth-perception stimuli.",
    thumbnail: '🪐'
  },
  "memory-matrix": {
    id: "memory-matrix",
    name: "Memory Matrix",
    component: MemoryMatrix,
    category: "Cognitive",
    description: "Visual working memory training using grid recall tasks.",
    thumbnail: '🧠'
  },
  "eagle-eye": {
    id: "eagle-eye",
    name: "Eagle Eye",
    component: EagleEye,
    category: "Visual Discrimination",
    description: "Visual search task to train figure-ground discrimination.",
    thumbnail: '🦅'
  },
  "peripheral-defender": {
    id: "peripheral-defender",
    name: "Peripheral Defender",
    component: PeripheralDefender,
    category: "Visual Field",
    description: "Expands field of view by forcing central fixation while tracking periphery.",
    thumbnail: '👁️'
  },
  "jungle-jump": {
    id: "jungle-jump",
    name: "Jungle Jump",
    component: JungleJump,
    category: "Reaction Time",
    description: "Gamified saccadic training requiring rapid motor response.",
    thumbnail: '🐸'
  }
};

export const getGameComponent = (gameId) => {
  const protocol = ProtocolRegistry[gameId];
  return protocol ? protocol.component : null;
};

export const getAllProtocols = () => Object.values(ProtocolRegistry);