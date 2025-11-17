import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null, // This is your 'userData' from Ranbhoomi
  token: null,    // We can store the token if needed, but we'll rely on cookies
  loading: true,  // Start in a loading state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This action is called when login or register is successful
    setCredentials: (state, action) => {
      state.userData = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    // This action is called on logout
    logout: (state) => {
      state.userData = null;
      state.token = null;
      state.loading = false;
    },
    // This is for the getCurrentUser hook
    stopLoading: (state) => {
      state.loading = false;
    }
  },
});

export const { setCredentials, logout, stopLoading } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.userData;
export const selectIsLoading = (state) => state.auth.loading;