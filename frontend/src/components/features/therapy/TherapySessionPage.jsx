import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGames } from '../../../redux/slices/therapySlice'; // Fixed path
import { FaPause, FaPlay, FaTimes, FaTrophy, FaRedo } from 'react-icons/fa';
import { api } from '../../../hooks/useGetCurrentUser'; // <-- Added
import { toast } from 'react-toastify'; // <-- Added

const TherapySessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const games = useSelector(selectGames);
  
  const gameData = games.find(g => g.id === id);

  // --- Game State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const containerRef = useRef(null);

  // --- Helper: Save Progress to Backend ---
  const saveProgress = async (finalScore, status = 'completed') => {
    try {
      await api.post('/therapy/save-session', {
        gameId: gameData.id,
        gameName: gameData.title,
        score: finalScore,
        durationPlayed: 30 - timeLeft, // Calculate how long they played
        status: status
      });
      toast.success("Progress saved!");
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Could not save progress");
    }
  };

  // --- Timer Logic (Updated) ---
  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) { // Check isPlaying to run only once
      setIsPlaying(false);
      setIsGameOver(true);
      saveProgress(score, 'completed'); // <-- CALL SAVE HERE
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, score]); // Added score to dependency array

  // --- "Game Engine" (Moving the Dot) ---
  useEffect(() => {
    let moveInterval;
    if (isPlaying) {
      moveInterval = setInterval(() => {
        if (containerRef.current) {
          const x = Math.floor(Math.random() * 90);
          const y = Math.floor(Math.random() * 90);
          setPosition({ top: `${y}%`, left: `${x}%` });
        }
      }, 1000);
    }
    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  // --- Handlers ---
  const handleStart = () => setIsPlaying(true);
  
  const handleTargetClick = () => {
    if (isPlaying) {
      setScore((prev) => prev + 10);
    }
  };

  // --- Updated Exit Handler ---
  const handleExit = () => {
    // If exiting early, save as 'aborted'
    if (isPlaying && !isGameOver) {
       // We don't await this because we want to navigate immediately
       saveProgress(score, 'aborted'); 
    }
    navigate('/patient/dashboard');
  };
  
  const handlePlayAgain = () => {
    // Reset all game states
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true); // Automatically start the game
  };

  if (!gameData) return <div className="text-white text-center mt-20">Game not found</div>;

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col z-50 overflow-hidden">
      
      {/* --- TOP HUD --- */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExit}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg">{gameData.title}</h2>
            <span className="text-xs text-cyan-400 uppercase tracking-widest">{gameData.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-8 font-mono">
          <div className="text-center">
            <p className="text-xs text-gray-400">SCORE</p>
            <p className="text-2xl font-bold text-yellow-400">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">TIME</p>
            <p className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </p>
          </div>
        </div>
      </div>

      {/* --- GAME AREA --- */}
      <div 
        ref={containerRef}
        className="relative flex-1 bg-gray-900 cursor-crosshair"
      >
        {!isPlaying && !isGameOver && (
          // START OVERLAY
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="text-center">
              <button 
                onClick={handleStart}
                className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-2xl transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
              >
                <span className="flex items-center gap-3">
                   <FaPlay /> START SESSION
                </span>
              </button>
              <p className="mt-4 text-gray-400">Click the moving target to score points</p>
            </div>
          </div>
        )}

        {isGameOver && (
           // GAME OVER OVERLAY
           <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20">
             <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center max-w-sm w-full shadow-2xl transform animate-blob">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <FaTrophy className="text-yellow-400 text-4xl" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
                <p className="text-gray-400 mb-6">Great job focusing today.</p>
                
                <div className="bg-gray-900 rounded-xl p-4 mb-8">
                    <p className="text-sm text-gray-500">FINAL SCORE</p>
                    <p className="text-4xl font-bold text-white">{score}</p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleExit}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all"
                    >
                        Save & Exit
                    </button>
                    <button 
                        onClick={handlePlayAgain} 
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                        <FaRedo /> Play Again
                    </button>
                </div>
             </div>
           </div>
        )}

        {/* --- THE TARGET (THE DOT) --- */}
        {isPlaying && (
          <div
            onClick={handleTargetClick}
            style={{ top: position.top, left: position.left }}
            className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.8)] cursor-pointer transition-all duration-1000 ease-in-out transform hover:scale-90 active:scale-75 flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-white rounded-full opacity-30 animate-ping"></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TherapySessionPage;