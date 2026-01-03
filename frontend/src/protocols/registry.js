import SpacePursuits from './neuro-ophthalmology/SpacePursuits';
import JungleJump from '../components/features/therapy/games/JungleJump';
import EagleEye from '../components/features/therapy/games/EagleEye';
import MemoryMatrix from '../components/features/therapy/games/MemoryMatrix';
import PeripheralDefender from '../components/features/therapy/games/PeripheralDefender';

export const CLINICAL_PROTOCOLS = {
  'p-001': {
    id: 'p-001',
    name: 'Space Pursuits',
    component: SpacePursuits, 
    type: 'canvas', 
  },
  'p-002': {
    id: 'p-002',
    name: 'Jungle Jump',
    component: JungleJump,
    type: 'dom', 
  },
  'p-003': {
    id: 'p-003',
    name: 'Eagle Eye',
    component: EagleEye,
    type: 'dom',
  },
  'p-004': {
    id: 'p-004',
    name: 'Peripheral Defender',
    component: PeripheralDefender,
    type: 'dom',
  },
  'p-005': {
    id: 'p-005',
    name: 'Memory Matrix',
    component: MemoryMatrix,
    type: 'dom',
  }
};

export const getProtocol = (id) => CLINICAL_PROTOCOLS[id];
export const getAllProtocols = () => Object.values(CLINICAL_PROTOCOLS);