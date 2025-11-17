import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../redux/slices/authSlice';

const DoctorRoute = () => {
  const userData = useSelector(selectUser);

  if (userData && userData.role === 'doctor') {
    return <Outlet />;
  }

  if (userData && userData.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default DoctorRoute;