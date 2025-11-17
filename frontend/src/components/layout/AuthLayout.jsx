import React from 'react';
// We'll use a text placeholder if the image doesn't exist yet to prevent crashing
// import logoFull from '../../assets/logo-full.png'; 

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        
        {/* --- Logo Section --- */}
        <div className="flex justify-center mb-6">
          {/* If you have the logo image, uncomment the img tag below */}
          {/* <img src={logoFull} alt="IndriyaX" className="h-12 object-contain" /> */}
          
          {/* For now, let's use text so it works immediately */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            IndriyaX
          </h1>
        </div>

        {/* --- Title & Subtitle --- */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
            {subtitle}
          </p>
        )}

        {/* --- The Form (Children) --- */}
        {children}

      </div>
    </div>
  );
};

export default AuthLayout;