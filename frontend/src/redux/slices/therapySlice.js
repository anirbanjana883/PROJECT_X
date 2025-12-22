import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assignedGames: [
    {
      id: 'g1',
      title: 'Space Pursuits',
      category: 'Oculomotor',
      description: 'Track the moving energy orb smoothly to improve eye tracking.',
      thumbnail: '🪐',
      color: 'from-blue-600 to-indigo-600',
      locked: false,
    },
    {
      id: 'g2',
      title: 'Jungle Jump',
      category: 'Saccades',
      description: 'Click the targets as they rapidly appear and disappear.',
      thumbnail: '🐸',
      color: 'from-green-500 to-emerald-700',
      locked: false,
    },
    {
      id: 'g3',
      title: 'Eagle Eye',
      category: 'Discrimination',
      description: 'Find the unique shape hidden among the distractors.',
      thumbnail: '🦅',
      color: 'from-amber-500 to-orange-600',
      locked: false,
    },
    {
      id: 'g4',
      title: 'Peripheral Defender',
      category: 'Peripheral',
      description: 'Keep your eyes on the center, but react to the edges.',
      thumbnail: '🛡️',
      color: 'from-purple-600 to-pink-600',
      locked: false,
    },
    {
      id: 'g5',
      title: 'Memory Matrix',
      category: 'Visual Memory',
      description: 'Remember the pattern and recreate it.',
      thumbnail: '🧩',
      color: 'from-cyan-500 to-teal-500',
      locked: false,
    }
  ],
  currentSession: null,
  loading: false,
};

const therapySlice = createSlice({
  name: 'therapy',
  initialState,
  reducers: {
    // ... existing reducers
  },
});

export const { startSession, endSession } = therapySlice.actions;
export const selectGames = (state) => state.therapy.assignedGames;

export default therapySlice.reducer;