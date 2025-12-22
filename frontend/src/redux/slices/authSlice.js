import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  loading: true, // Start true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userData = action.payload.user;
      state.loading = false; // Ensure loading stops
    },
    logout: (state) => {
      state.userData = null;
      state.loading = false; // Ensure loading stops
    },
    stopLoading: (state) => {
      state.loading = false; // Helper to stop loading manually
    }
  },
});

export const { setCredentials, logout, stopLoading } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.userData;
export const selectIsLoading = (state) => state.auth.loading;