import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, stopLoading } from '../redux/slices/authSlice';
import axios from 'axios';

// Create the Axios instance here so we can use it in Login/Signup pages too
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    // If we already have user data, stop loading and return
    if (userData) {
      dispatch(stopLoading());
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        dispatch(setCredentials({ user: data.user }));
      } catch (error) {
        // If 401 or error, it means user is not logged in
        dispatch(stopLoading());
      }
    };

    fetchUser();
  }, [dispatch, userData]);
};

export default useGetCurrentUser;