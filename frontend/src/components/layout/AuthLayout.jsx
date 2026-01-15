import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      
      {/* --- LEFT SIDE: Professional Branding Panel --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-800 text-white items-center justify-center">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

        <div className="relative z-10 p-16 max-w-xl">
           <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                    <FaHeartbeat className="text-3xl" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">IndriyaX</h1>
           </div>
            <h2 className="text-3xl font-semibold mb-6 leading-tight">
                Precision in Vision Therapy Management.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90 font-light">
                A secure, HIPAA-compliant platform designed for professional optometrists and patient care coordination.
            </p>
            
            <div className="mt-16 pt-8 border-t border-blue-400/30 flex gap-8 text-sm font-semibold tracking-wider text-blue-200 uppercase">
                <span>Enterprise Security</span>
                <span>Clinical Workflow</span>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: The Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-xl lg:shadow-none z-10">
        <div className="w-full max-w-md space-y-8">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 text-blue-800 dark:text-blue-500 mb-8">
                <FaHeartbeat className="text-2xl" />
                <span className="text-xl font-bold">IndriyaX</span>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {subtitle}
                </p>
            </div>

            <div className="mt-10">
                {children}
            </div>

             <div className="mt-12 text-center text-xs text-gray-500">
                &copy; 2026 IndriyaX. Secure Medical Systems.
             </div>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;