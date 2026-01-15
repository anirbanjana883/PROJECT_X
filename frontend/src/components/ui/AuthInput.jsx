import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthInput = ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    icon: Icon, 
    required = true,
    minLength,
    error 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    
    // Logic: If it's a password field and 'show' is true, turn it to text.
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative group">
                {/* Left Icon (Visual Context) */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    {Icon && <Icon className="text-lg" />}
                </div>

                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    className={`w-full pl-10 pr-10 py-3 
        bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
        border rounded-md font-medium
        placeholder-gray-400 transition-all duration-150
        focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600
        ${error 
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
          // Thicker, sharper border on un-focused state
          : 'border-gray-300 dark:border-gray-700 shadow-sm hover:border-gray-400'
        }
    `}
                    placeholder={placeholder}
                />

                {/* Password Toggle Button (Interactive) */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-gray-200 cursor-pointer transition-colors focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AuthInput;