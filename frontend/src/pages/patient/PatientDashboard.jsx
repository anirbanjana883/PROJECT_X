import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { FaChartLine, FaGamepad, FaCalendarCheck } from 'react-icons/fa';

const PatientDashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hello, {user?.name || 'Patient'} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ready for your daily vision therapy session?
        </p>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Daily Goal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Daily Goal</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <FaCalendarCheck />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">0 / 30</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">minutes completed</p>
        </div>

        {/* Card 2: Current Level */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Next Game</h3>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <FaGamepad />
                </div>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">Space Pursuits</div>
            <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Start Playing
            </button>
        </div>

        {/* Card 3: Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Progress</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <FaChartLine />
                </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">Level 3</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;