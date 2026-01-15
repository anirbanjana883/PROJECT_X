import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <FaShieldAlt className="text-5xl text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        You do not have permission to view this page. If you believe this is an error, please contact support.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;