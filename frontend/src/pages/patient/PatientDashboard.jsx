import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { selectGames } from '../../redux/slices/therapySlice'; // Import selector
import GameCard from '../../components/features/therapy/GameCard'; // Import Card
import { FaFire } from 'react-icons/fa';

const PatientDashboard = () => {
  const user = useSelector(selectUser);
  const games = useSelector(selectGames);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* --- Welcome Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Mission Control
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, <span className="text-blue-600 dark:text-blue-400 font-semibold">{user?.name}</span>. 
            Let's train your vision.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-full text-orange-600 dark:text-orange-400">
            <FaFire className="animate-pulse" />
            <span className="font-bold">3 Day Streak</span>
        </div>
      </div>
      
      {/* --- Games Grid --- */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        Assigned Therapies
        <span className="text-sm font-normal bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500">
          {games.length} Available
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

    </div>
  );
};

export default PatientDashboard;