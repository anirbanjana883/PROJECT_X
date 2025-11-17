import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../redux/slices/authSlice';

const PatientRoute = () => {
  const userData = useSelector(selectUser);

  if (userData && userData.role === 'patient') {
    return <Outlet />;
  }
  
  // If logged in but not a patient (e.g. doctor), go to doctor dash
  if (userData && userData.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default PatientRoute;