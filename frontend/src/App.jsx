import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

// Hooks & Utils
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import ScrollToTop from "./components/ui/ScrollToTop";
import { selectUser, selectIsLoading } from "./redux/slices/authSlice";

// Components
import Navbar from "./components/layout/Navbar";

// Route Guards
import PatientRoute from "./routes/PatientRoute";
import DoctorRoute from "./routes/DoctorRoute";
import AdminRoute from "./routes/AdminRoute";

// Pages
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import TherapySessionPage from "./components/features/therapy/TherapySessionPage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

export const serverUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : "http://localhost:5000";

function App() {
  // 1. Fetch User
  useGetCurrentUser();

  // 2. Get State
  const userData = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  // 3. Navbar Logic
  const hideNavPaths = ["/login", "/signup", "/forgot-password"];
  const showNav = !hideNavPaths.includes(location.pathname) &&
                  !location.pathname.startsWith("/therapy/session/");

  // --- HELPER: Determine where to send logged-in users ---
  const getDashboardRoute = () => {
    if (!userData) return "/login";
    if (userData.role === 'admin') return "/admin/dashboard"; // <-- ADDED THIS
    if (userData.role === 'doctor') return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  // --- BLOCK RENDER UNTIL LOADING IS DONE ---
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
         <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      
      {showNav && <Navbar />}

      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
      <ScrollToTop />

      <div className={showNav ? "pt-16" : ""}>
        <Routes>
          
          {/* Public Route */}
          <Route path="/" element={<HomePage />} />

          {/* Auth Routes (Using the new helper function) */}
          <Route
            path="/login"
            element={!userData ? <LoginPage /> : <Navigate to={getDashboardRoute()} />}
          />
          <Route
            path="/signup"
            element={!userData ? <SignupPage /> : <Navigate to={getDashboardRoute()} />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected: Patient */}
          <Route element={<PatientRoute />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/therapy/session/:id" element={<TherapySessionPage />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
          </Route>

          {/* Protected: Doctor */}
          <Route element={<DoctorRoute />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            {/* <Route path="/doctor/patient/:patientId" element={<DoctorPatientView />} /> */}
          </Route>

          {/* Protected: Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="text-center mt-20 text-2xl">404 - Page Not Found</div>} />

        </Routes>
      </div>
    </div>
  );
}

export default App;