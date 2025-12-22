import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser, selectIsLoading } from '../redux/slices/authSlice';

const PatientRoute = () => {
  const userData = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  // 1. If loading, show nothing (or a spinner) - DO NOT REDIRECT YET
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // 2. User is logged in AND is a patient
  if (userData && userData.role === 'patient') {
    return <Outlet />;
  }

  // 3. User is logged in BUT is a doctor -> Send to Doctor Dash
  if (userData && userData.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
  }

  // 4. User is NOT logged in -> Send to Login
  return <Navigate to="/login" replace />;
};

export default PatientRoute;