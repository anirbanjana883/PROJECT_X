import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../redux/slices/authSlice';
import ThemeToggle from '../features/theme/ThemeToggle';
import { api } from '../../hooks/useGetCurrentUser';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

// Placeholder text logo if image is missing
// import logoIcon from '../../assets/logo-icon.png'; 

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
        await api.get('/auth/logout');
        dispatch(logout());
        navigate('/login');
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center space-x-2">
            {/* <img src={logoIcon} alt="Logo" className="h-8 w-8" /> */}
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              IndriyaX
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                   <FaUserCircle className="text-lg"/> {user.name}
                </span>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-gray-300">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user ? (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 font-medium">
                 Logout
               </button>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 dark:text-gray-300">Login</Link>
                <Link to="/signup" className="block px-3 py-2 text-blue-600 font-bold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;