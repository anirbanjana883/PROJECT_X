import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBolt, FaArrowLeft } from 'react-icons/fa';
import { useTherapyPlan } from '../../../hooks/useTherapyPlan';
import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser'; 
import { getGameComponent } from '../../../protocols/registry'; 
import SessionReportModal from './SessionReportModal';

const TherapySessionPage = () => {
  const { sessionId } = useParams(); 
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();
  const { plan, loading } = useTherapyPlan(currentUser?._id);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [showReport, setShowReport] = useState(false);

  // --- DEBUG LOGS (Optional: Remove later) ---
  useEffect(() => {
    if (!loading && plan) {
        console.log("Searching for:", sessionId);
        console.log("In Plan:", plan);
    }
  }, [loading, plan, sessionId]);

  // --- FIX: ROBUST LOOKUP ---
  // We check if the URL param matches the 'gameId' (space-pursuits) OR the '_id' (6958...)
  const currentAssignment = plan?.find(p => p.gameId === sessionId || p._id === sessionId);

  // Load Component
  const GameComponent = currentAssignment ? getGameComponent(currentAssignment.gameId) : null;

  const handleScore = (points) => setScore(s => s + points);
  const handleMiss = () => { /* optional sound effect */ };

  // --- LOADING ---
  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-cyan-500 font-mono">
        <div className="animate-spin text-4xl mb-4"><FaBolt /></div>
        <p className="animate-pulse tracking-widest text-sm">LOADING PROTOCOL...</p>
    </div>
  );

  // --- ERROR STATE ---
  if (!currentAssignment || !GameComponent) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-6 text-center">
        <FaBolt className="text-4xl mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">PROTOCOL NOT FOUND</h2>
        <p className="text-sm text-gray-500 mb-6">
           Could not match ID: <span className="text-white">"{sessionId}"</span>
        </p>
        <button 
            onClick={() => navigate('/patient/dashboard')}
            className="px-6 py-2 border border-red-500 rounded hover:bg-red-900/30 transition flex items-center gap-2"
        >
            <FaArrowLeft /> Return to Dashboard
        </button>
    </div>
  );

  // --- RENDER ---
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-6 py-3 text-cyan-400 font-mono">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Active Protocol</span>
            <span className="text-lg font-bold text-white shadow-cyan-500/50 drop-shadow-sm">{currentAssignment.gameName}</span>
        </div>
        
        <div className="flex gap-4 items-center pointer-events-auto">
             <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-6 py-3 text-white font-mono text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Score</span>
                <span className="text-xl font-bold">{score}</span>
             </div>
             
             <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-8 py-3 rounded-lg font-bold tracking-wider transition-all shadow-lg ${isPlaying ? 'bg-slate-700 text-slate-300' : 'bg-cyan-600 text-white'}`}
             >
                {isPlaying ? 'PAUSE' : 'START SESSION'}
             </button>
             
             <button 
                onClick={() => navigate('/patient/dashboard')}
                className="p-3 rounded-lg bg-red-900/20 border border-red-900/50 text-red-500 hover:bg-red-900/40 transition-all"
             >
                Exit
             </button>
        </div>
      </div>

      {/* GAME RENDERER */}
      <div className="w-full h-full">
         <GameComponent 
            config={currentAssignment.config} 
            isPlaying={isPlaying}
            onScore={handleScore}
            onMiss={handleMiss}
            difficulty={currentAssignment.config?.speed || 5} 
         />
      </div>

      <SessionReportModal 
         isOpen={showReport} 
         onClose={() => navigate('/patient/dashboard')}
         score={score}
         gameName={currentAssignment.gameName}
      />
    </div>
  );
};

export default TherapySessionPage;