import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import therapyReducer from './slices/therapySlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    therapy: therapyReducer, 
  },
  devTools: process.env.NODE_ENV !== 'production',
});