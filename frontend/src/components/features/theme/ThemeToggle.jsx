import React from 'react';
import { useTheme } from '../../../context/ThemeContext'; // Go up 3 levels to find context
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
      
      {/* Light Mode */}
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'light' 
            ? 'bg-white text-yellow-500 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="Light Mode"
      >
        <FaSun size={14} />
      </button>

      {/* System Mode */}
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'system' 
            ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="System Default"
      >
        <FaDesktop size={14} />
      </button>

      {/* Dark Mode */}
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-gray-700 text-indigo-400 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        title="Dark Mode"
      >
        <FaMoon size={14} />
      </button>
      
    </div>
  );
};

export default ThemeToggle;