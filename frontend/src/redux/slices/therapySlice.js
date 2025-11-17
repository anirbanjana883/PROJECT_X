import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Mock data for now - later this comes from Backend
  assignedGames: [
    {
      id: 'g1',
      title: 'Space Pursuits',
      category: 'Oculomotor',
      description: 'Track moving targets to improve smooth pursuit eye movements.',
      thumbnail: '🚀',
      color: 'from-purple-500 to-indigo-500',
      locked: false,
    },
    {
      id: 'g2',
      title: 'Depth Diver',
      category: 'Vergence',
      description: 'Focus in and out to strengthen binocular fusion.',
      thumbnail: '🌊',
      color: 'from-blue-500 to-cyan-500',
      locked: false,
    },
    {
      id: 'g3',
      title: 'Letter Hunt',
      category: 'Saccades',
      description: 'Rapidly find letters to improve reading speed.',
      thumbnail: '🅰️',
      color: 'from-emerald-500 to-teal-500',
      locked: true, // Example of a locked level
    }
  ],
  currentSession: null,
  loading: false,
};

const therapySlice = createSlice({
  name: 'therapy',
  initialState,
  reducers: {
    startSession: (state, action) => {
      state.currentSession = action.payload;
    },
    endSession: (state) => {
      state.currentSession = null;
    }
  },
});

export const { startSession, endSession } = therapySlice.actions;
export const selectGames = (state) => state.therapy.assignedGames;

export default therapySlice.reducer;