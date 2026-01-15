import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, stopLoading } from '../redux/slices/authSlice';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// 1. Export API Instance
export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// 2. Export Hook
export const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.auth);
  
  // FIX: Use a ref to prevent double-fetching or infinite loops on 401
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if:
    // 1. We don't have user data
    // 2. We haven't tried fetching yet in this mount
    if (!userData && !hasFetched.current) {
        hasFetched.current = true; // Mark as attempted

        const fetchUser = async () => {
            try {
                // Optional: dispatch(startLoading()) if your redux slice doesn't default to loading:true
                const { data } = await api.get('/auth/me');
                dispatch(setCredentials({ user: data.user }));
            } catch (error) {
                // If 401/403, simply stop loading. The UI will redirect if needed.
                dispatch(stopLoading());
            }
        };
        fetchUser();
    }
  }, [dispatch, userData]); // Removed 'loading' from dependency to prevent loop

  return { currentUser: userData, loading };
};

export default useGetCurrentUser;