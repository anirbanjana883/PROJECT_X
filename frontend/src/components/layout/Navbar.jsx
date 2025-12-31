import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../../redux/slices/authSlice';
import { api } from '../../hooks/useGetCurrentUser';
import { FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import ThemeToggle from '../features/theme/ThemeToggle'; 

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    // NAVBAR: Pitch black glass with subtle bottom border
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo: Glowing Medical Tech */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-sans">
              INDRIYA<span className="text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">X</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-4 rounded-full bg-gray-100 dark:bg-[#111] hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition-all border border-transparent dark:border-gray-800 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#050505] flex items-center justify-center">
                       <span className="font-bold text-xs text-cyan-600 dark:text-cyan-400">
                         {user.name.charAt(0).toUpperCase()}
                       </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide group-hover:text-cyan-500 transition-colors">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown: Technical & Sharp */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-card p-0 animate-fadeIn origin-top-right z-50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]/50">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link 
                        to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                      >
                        <FaTachometerAlt /> Dashboard
                      </Link>
                      
                      <Link 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                      >
                        <FaCog /> System Settings
                      </Link>
                    </div>

                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all uppercase tracking-wide"
                      >
                        <FaSignOutAlt /> Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest hover:text-cyan-500 transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary py-2 px-5 text-[10px]">Initialize</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-gray-300">
               {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;