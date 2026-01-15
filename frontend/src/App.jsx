import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router } ...  <-- REMOVE THIS IMPORT
import { Toaster } from 'react-hot-toast';
import { useGetCurrentUser } from './hooks/useGetCurrentUser';

// Pages
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';

// Security
import ProtectedRoute from './components/layout/ProtectedRoute';

// --- Placeholder Dashboards ---
const DoctorDashboard = () => <div className="p-10 text-2xl">👨‍⚕️ Doctor Dashboard (Locked)</div>;
const PatientDashboard = () => <div className="p-10 text-2xl">🏥 Patient Dashboard (Locked)</div>;
const AdminDashboard = () => <div className="p-10 text-2xl">⚙️ Admin Dashboard (Locked)</div>;

const App = () => {
  // 1. Fetch User on Mount
  useGetCurrentUser(); 

  return (
    <>
      {/* Toaster can sit here, outside the Routes but inside the Main Router */}
      <Toaster position="top-center" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔒 PROTECTED: DOCTOR */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* 🔒 PROTECTED: PATIENT */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route>

        {/* 🔒 PROTECTED: ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
};

export default App;