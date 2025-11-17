import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6">
        Vision Therapy Reimagined.
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Clinically proven, gamified vision exercises for Amblyopia and Convergence Insufficiency. Train your eyes from the comfort of your home.
      </p>
      <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/30">
        Start Your Journey
      </Link>
    </div>
  );
};

export default HomePage;