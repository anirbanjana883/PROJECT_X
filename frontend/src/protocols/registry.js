import SpacePursuits from './neuro-ophthalmology/SpacePursuits';
// import MemoryGrid from './cognitive/MemoryGrid'; 

export const CLINICAL_PROTOCOLS = {
  'p-001': {
    id: 'p-001',
    name: 'Oculomotor Tracking (3D)',
    category: 'Neuro-Ophthalmology',
    description: 'Trains smooth pursuit capabilities using depth-perception stimuli.',
    component: SpacePursuits, // The actual code
    clinicalTags: ['Amblyopia', 'Vergence', 'Focus'],
    defaultDuration: 300,
    thumbnail: '🪐' // Replace with a medical icon later
  },
  'p-002': {
    id: 'p-002',
    name: 'Saccadic Precision Matrix',
    category: 'Oculomotor',
    description: 'Rapid eye movement training for reading speed and fixation.',
    component: null, // Placeholder for now
    clinicalTags: ['Reading', 'Fixation'],
    defaultDuration: 180,
    thumbnail: '🎯'
  }
};

export const getProtocol = (id) => CLINICAL_PROTOCOLS[id];
export const getAllProtocols = () => Object.values(CLINICAL_PROTOCOLS);