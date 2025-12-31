import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";

// Hooks & Utils
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import ScrollToTop from "./components/ui/ScrollToTop";
import { selectIsLoading } from "./redux/slices/authSlice";

// Layout
import Navbar from "./components/layout/Navbar";

// Routing
import AppRoutes from "./routes/AppRoutes"; // ✅ Import the new router

export const serverUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : "http://localhost:5000";

function App() {
  // 1. Fetch User Session
  useGetCurrentUser();

  // 2. Global State
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  // 3. Navbar Visibility Logic
  // Hide navbar on Auth pages and inside Game Sessions
  const hideNavPaths = ["/login", "/signup", "/forgot-password"];
  const isGameSession = location.pathname.startsWith("/therapy/session/");
  const showNav = !hideNavPaths.includes(location.pathname) && !isGameSession;

  // 4. Loading Screen (Block app until auth check completes)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-[#020617]">
         <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
         <p className="text-cyan-500 font-bold animate-pulse tracking-widest text-sm">INITIALIZING INDRIYA-X...</p>
      </div>
    );
  }

  return (
    <div className="app-bg">
      {showNav && <Navbar />}

      <ToastContainer 
        position="bottom-right" 
        theme="colored" 
        autoClose={3000}
        toastClassName="!bg-[#111] !text-white !font-bold !rounded-xl !border !border-gray-800" 
      />
      
      <ScrollToTop />

      {/* Main Content Area */}
      <div className={showNav ? "pt-16" : ""}>
        <AppRoutes /> {/* ✅ All routes are handled here now */}
      </div>
    </div>
  );
}

export default App;