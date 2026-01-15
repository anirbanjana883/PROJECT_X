import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

// --- Import Pages ---
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import HomePage from '../pages/public/HomePage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import TherapySessionPage from '../components/features/therapy/TherapySessionPage';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorPatientView from '../pages/doctor/DoctorPatientView'; 

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

// Common Pages
import ProfilePage from '../pages/common/ProfilePage';

// --- Import Guards ---
import PatientRoute from './PatientRoute';
import DoctorRoute from './DoctorRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  const user = useSelector(selectUser);

  // Helper: Redirect logged-in users away from Login page
  const getDashboardRoute = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin/dashboard";
    if (user.role === 'doctor') return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<HomePage />} />
      
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to={getDashboardRoute()} replace />} 
      />
      <Route 
        path="/signup" 
        element={!user ? <SignupPage /> : <Navigate to={getDashboardRoute()} replace />} 
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* --- PROTECTED: PATIENT --- */}
      <Route element={<PatientRoute />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        
        {/* FIX: Changed :id to :sessionId to match TherapySessionPage.jsx */}
        <Route path="/therapy/session/:sessionId" element={<TherapySessionPage />} />
        
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* --- PROTECTED: DOCTOR --- */}
      <Route element={<DoctorRoute />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patient/:patientId" element={<DoctorPatientView />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* --- PROTECTED: ADMIN --- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* --- 404 Fallback --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;