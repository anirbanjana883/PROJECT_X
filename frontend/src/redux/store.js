import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // We will add other slices here (e.g., therapySlice, doctorSlice)
  },
  devTools: process.env.NODE_ENV !== 'production',
});