import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hooks & Utils
import useGetCurrentUser from './hooks/useGetCurrentUser';
import ScrollToTop from './components/ui/ScrollToTop';

// Components
import Navbar from './components/layout/Navbar';

// Route Guards
import PatientRoute from './routes/PatientRoute';
import DoctorRoute from './routes/DoctorRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import PatientProfile from './pages/patient/PatientProfile';

// Protected Pages
import PatientDashboard from './pages/patient/PatientDashboard';
// import PatientTherapySession from './pages/patient/PatientTherapySession'; // Example
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import TherapySessionPage from './components/features/therapy/TherapySessionPage';

// Global Server URL (Optional, if you need it exported)
export const serverUrl = "http://localhost:5000"; 

function App() {
  // 1. Fetch current user on load
  useGetCurrentUser();
  
  // 2. Get user data from Redux (slice name is 'auth' in our setup)
  const { userData } = useSelector(state => state.auth);
  
  const location = useLocation();

  // 3. Logic to Hide Navbar
  const hideNavPaths = ['/login', '/signup', '/forgot-password'];

  const showNav = !hideNavPaths.includes(location.pathname) && 
                  !location.pathname.startsWith('/therapy/session/'); // Hide nav during game sessions

  return (
    // This outer div handles the Dark/Light Theme background globally
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      
      {/* Conditionally render the Nav */}
      {showNav && <Navbar />}

      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
      <ScrollToTop />

      {/* Add padding-top if Navbar is present to prevent overlap */}
      <div className={showNav ? "pt-16" : ""}>
        <Routes>
          
          {/* --- PUBLIC ROUTES --- */}
          <Route path='/' element={<HomePage />} />
          
          {/* Guest Only Routes (Redirect to dashboard if logged in) */}
          <Route 
            path='/signup' 
            element={!userData ? <SignupPage/> : <Navigate to={userData.role === 'doctor' ? "/doctor/dashboard" : "/patient/dashboard"}/>}
          />
          <Route 
            path='/login' 
            element={!userData ? <LoginPage /> : <Navigate to={userData.role === 'doctor' ? "/doctor/dashboard" : "/patient/dashboard"} />} 
          />
          <Route 
            path='/forgot-password' 
            element={!userData ? <ForgotPasswordPage/> : <Navigate to="/"/>}
          />


          {/* --- PATIENT ROUTES (Role Based) --- */}
          <Route element={<PatientRoute />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/therapy/session/:id" element={<TherapySessionPage />} />
            {/* <Route path="/therapy/session/:id" element={<PatientTherapySession />} /> */}
            <Route path="/patient/profile" element={<PatientProfile />} />
          </Route>


          {/* --- DOCTOR ROUTES (Role Based) --- */}
          <Route element={<DoctorRoute />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            {/* <Route path="/doctor/patients" element={<PatientListPage />} /> */}
          </Route>


          {/* --- 404 Not Found --- */}
          <Route path="*" element={<div className="text-center mt-20 text-2xl">404 - Page Not Found</div>} />

        </Routes>
      </div>
    </div>
  );
}

export default App;