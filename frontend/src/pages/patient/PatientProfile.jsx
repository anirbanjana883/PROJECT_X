import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { api } from '../../hooks/useGetCurrentUser';
import { FaSpinner, FaCalendarAlt, FaTrophy, FaGamepad, FaStar, FaChartLine } from 'react-icons/fa';

const PatientProfile = () => {
  const user = useSelector(selectUser);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/therapy/history');
        setHistory(data.history);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- Mock Stats (Replace with real data later) ---
  const totalScore = history.reduce((acc, session) => acc + session.score, 0);
  const sessionsPlayed = history.length;
  const bestGame = "Space Pursuits"; // Logic to calculate this

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* --- Profile Header (Glass Card) --- */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-3xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl">
        <div className="text-6xl p-5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full text-white shadow-lg animate-pulse-glow">
          <FaTrophy />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user?.name}'s Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
          <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 rounded-full uppercase">
            {user?.role}
          </span>
        </div>
      </div>

      {/* --- Glowing Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<FaGamepad />} title="Sessions Played" value={sessionsPlayed} color="blue" />
        <StatCard icon={<FaStar />} title="Total Score" value={totalScore} color="yellow" />
        <StatCard icon={<FaChartLine />} title="Best Game" value={bestGame} color="green" />
      </div>

      {/* --- Session History --- */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Recent Activity
      </h2>

      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-3xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : history.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-gray-500">
            <h3 className="text-xl font-medium">No sessions found</h3>
            <p>Play a game to see your progress here!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700/50">
            {history.map((session) => (
              <li key={session._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors duration-200 group">
                <div className="flex items-center gap-4">
                  <div className="text-xl p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    🚀 {/* Placeholder icon */}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {session.gameName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                      <FaCalendarAlt size={12} />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                    {session.score} <span className="text-sm font-normal">pts</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.durationPlayed} seconds
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

// --- Reusable Stat Card Component ---
const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "text-blue-500 dark:text-blue-400 shadow-blue-500/30",
    yellow: "text-yellow-500 dark:text-yellow-400 shadow-yellow-500/30",
    green: "text-green-500 dark:text-green-400 shadow-green-500/30",
  };
  
  return (
    <div className={`p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all ${colors[color]}`}>
      <div className="text-3xl mb-4">{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{title}</p>
      <p className={`text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-[0_0_5px]`}>{value}</p>
    </div>
  );
};

export default PatientProfile;