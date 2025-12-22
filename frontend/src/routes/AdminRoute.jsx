import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser, selectIsLoading } from '../redux/slices/authSlice';

const AdminRoute = () => {
  const userData = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  // 1. CRITICAL FIX: Wait for loading to finish
  // If we redirect while loading is true, it causes the infinite loop.
  if (isLoading) {
    return null; // Or a loading spinner
  }

  // 2. Check if user is Admin
  if (userData && userData.role === 'admin') {
    return <Outlet />;
  }

  // 3. Redirect unauthorized users
  return <Navigate to="/login" replace />;
};

export default AdminRoute;