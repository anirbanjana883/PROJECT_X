import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGames } from '../../../redux/slices/therapySlice';
import { api } from '../../../hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { FaTimes, FaTrophy, FaRedo, FaPlay } from 'react-icons/fa';

// Import Games
import SpacePursuits from '../../../components/features/therapy/games/SpacePursuits';
import JungleJump from '../../../components/features/therapy/games/JungleJump';
import EagleEye from '../../../components/features/therapy/games/EagleEye';
import PeripheralDefender from '../../../components/features/therapy/games/PeripheralDefender';
import MemoryMatrix from '../../../components/features/therapy/games/MemoryMatrix';

const TherapySessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const games = useSelector(selectGames);
  const gameData = games.find(g => g.id === id);

  // --- Game Logic ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  // --- Timer ---
  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setIsGameOver(true);
      saveProgress(score, 'completed');
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, score]);

  // --- Save Logic ---
  const saveProgress = async (finalScore, status) => {
    try {
      await api.post('/therapy/save-session', {
        gameId: gameData.id,
        gameName: gameData.title,
        score: finalScore,
        durationPlayed: 30 - timeLeft,
        status: status
      });
      toast.success("Session saved!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleScore = () => setScore(p => p + 10);
  
  const handleExit = () => {
    if (isPlaying) saveProgress(score, 'aborted');
    navigate('/patient/dashboard');
  };

  if (!gameData) return <div>Game Not Found</div>;

  // --- Render the correct Game Component ---
  const renderGame = () => {
    switch(gameData.id) {
        case 'g1': return <SpacePursuits isPlaying={isPlaying} onScore={handleScore} />;
        case 'g2': return <JungleJump isPlaying={isPlaying} onScore={handleScore} />;
        case 'g3': return <EagleEye isPlaying={isPlaying} onScore={handleScore} />;
        case 'g4': return <PeripheralDefender isPlaying={isPlaying} onScore={handleScore} />;
        case 'g5': return <MemoryMatrix isPlaying={isPlaying} onScore={handleScore} />;
        default: return <div className="text-white">Game Component Missing</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col z-50">
      {/* HUD */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800/80 backdrop-blur-md border-b border-gray-700">
        <div className="flex items-center gap-4">
            <button onClick={handleExit} className="p-2 rounded-full hover:bg-gray-700"><FaTimes /></button>
            <div>
                <h2 className="font-bold">{gameData.title}</h2>
                <span className="text-xs text-cyan-400 uppercase">{gameData.category}</span>
            </div>
        </div>
        <div className="flex gap-8 font-mono text-xl">
            <div>SCORE: <span className="text-yellow-400">{score}</span></div>
            <div>TIME: <span className={timeLeft < 10 ? "text-red-500 animate-pulse" : ""}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span></div>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
         {renderGame()}

         {/* Overlays */}
         {!isPlaying && !isGameOver && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                 <button onClick={() => setIsPlaying(true)} className="px-10 py-5 bg-blue-600 rounded-2xl font-bold text-2xl flex gap-3 items-center hover:scale-105 transition-transform">
                    <FaPlay /> START
                 </button>
             </div>
         )}
         {isGameOver && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                 <div className="bg-gray-800 p-8 rounded-3xl text-center border border-gray-700 shadow-2xl">
                    <FaTrophy className="text-5xl text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Complete!</h2>
                    <p className="text-4xl font-bold mt-4 mb-8">{score} pts</p>
                    <div className="flex gap-4">
                        <button onClick={handleExit} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold">Exit</button>
                        <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-gray-700 rounded-xl">Retry</button>
                    </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default TherapySessionPage;