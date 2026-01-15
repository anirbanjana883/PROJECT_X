import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoading } from '../../redux/slices/authSlice';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  // 1. Show a loading spinner while Redux/Auth is rehydrating
  // This prevents "flickering" to the login page on refresh
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="text-4xl text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  // 2. If not logged in, kick them out
  if (!user) {
    // We pass "state" so we can redirect them back here after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If logged in but wrong role (e.g. Patient trying to access Doctor Page)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Access Granted
  return <Outlet />;
};

export default ProtectedRoute;