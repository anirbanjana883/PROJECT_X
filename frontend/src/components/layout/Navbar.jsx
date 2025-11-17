import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../redux/slices/authSlice';
import ThemeToggle from '../features/theme/ThemeToggle';
import { api } from '../../hooks/useGetCurrentUser';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Handlers ---
  const handleLogout = async () => {
    try {
        await api.get('/auth/logout');
        dispatch(logout());
        setIsMobileMenuOpen(false); // Close menu on action
        navigate('/login');
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  const handleProfileClick = () => {
    setIsMobileMenuOpen(false); // Close menu on action
    navigate('/patient/profile');
  };

  // Helper for mobile links
  const mobileLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Indriya<span className="text-blue-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">X</span>
            </span>
          </Link>

          {/* --- Desktop Menu (Hidden on md and down) --- */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleProfileClick}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaUserCircle className="text-lg"/> 
                  {user.name}
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
          
          {/* --- Mobile Menu Button (Visible on md and down) --- */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-gray-300">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown (Corrected) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user ? (
               <>
                 <button 
                   onClick={handleProfileClick} // <-- FIXED: Added handler
                   className="block w-full text-left px-3 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3"
                 >
                   <FaUserCircle /> Profile ({user.name})
                 </button>
                 <button 
                   onClick={handleLogout} 
                   className="block w-full text-left px-3 py-3 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex items-center gap-3"
                 >
                   <FaSignOutAlt /> Logout
                 </button>
               </>
            ) : (
              <>
                <button 
                  onClick={() => mobileLinkClick('/login')}
                  className="block w-full text-left px-3 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3"
                >
                  <FaSignInAlt /> Login
                </button>
                <button 
                  onClick={() => mobileLinkClick('/signup')}
                  className="block w-full text-left px-3 py-3 bg-blue-600 text-white font-medium rounded-lg flex items-center gap-3"
                >
                  <FaUserPlus /> Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;