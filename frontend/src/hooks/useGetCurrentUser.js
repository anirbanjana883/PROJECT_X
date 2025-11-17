import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, stopLoading } from '../redux/slices/authSlice';
import axios from 'axios';

// Create the Axios instance here so we can use it in Login/Signup pages too
export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Make sure this matches your backend PORT
  withCredentials: true, // CRITICAL: This allows cookies to be sent/received
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