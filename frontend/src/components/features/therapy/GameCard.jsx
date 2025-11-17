import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook
import { FaLock, FaPlay } from 'react-icons/fa';

const GameCard = ({ game }) => {
  const navigate = useNavigate(); // 2. Initialize hook

  // 3. Create Handler
  const handlePlayClick = () => {
    if (!game.locked) {
      navigate(`/therapy/session/${game.id}`);
    }
  };

  return (
    <div className="relative group h-64 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full justify-between">
        
        {/* Top Section */}
        <div>
          <div className="flex justify-between items-start">
            <span className="text-4xl filter drop-shadow-md">{game.thumbnail}</span>
            {game.locked && <FaLock className="text-gray-400" />}
          </div>
          
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>
          <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 rounded-md uppercase tracking-wider">
            {game.category}
          </span>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {game.description}
          </p>
        </div>

        {/* Action Button (Now using onClick + navigate) */}
        <div className="mt-4">
          {game.locked ? (
            <button disabled className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium cursor-not-allowed">
              Locked
            </button>
          ) : (
            <button 
              onClick={handlePlayClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-center shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:animate-shimmer-effect overflow-hidden relative cursor-pointer"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:shimmer-effect"></div>
              <span className="relative z-10 flex items-center gap-2">
                Start Session <FaPlay size={12} />
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default GameCard;