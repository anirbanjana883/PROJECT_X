import React from 'react';
import { FcGoogle } from 'react-icons/fc'; 

const GoogleButton = ({ onClick, text = "Continue with Google" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
    >
      <FcGoogle className="text-xl group-hover:scale-110 transition-transform duration-200" />
      <span>{text}</span>
    </button>
  );
};

export default GoogleButton;