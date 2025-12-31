import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../hooks/useGetCurrentUser'; // Your Axios instance
import { toast } from 'react-toastify';
import { 
    FaPause, FaPlay, FaStop, FaExpand, FaCompress, FaEye, FaBrain 
} from 'react-icons/fa';

// ✅ 1. Import Registry to map "gameId" -> React Component
import { getProtocol } from '../../../protocols/registry'; 
import SessionReportModal from './SessionReportModal';

const TherapySessionPage = () => {
  const { id } = useParams(); // This is now the ASSIGNMENT ID (Mongo ObjectId)
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // --- State ---
  const [assignment, setAssignment] = useState(null); // The DB Record
  const [ActiveComponent, setActiveComponent] = useState(null); // The Game Component
  const [loading, setLoading] = useState(true);
  
  // --- Game Vitals ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showReport, setShowReport] = useState(false);

  // 1. FETCH THE PRESCRIPTION
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // In a real app, you'd have GET /api/therapy/assignment/:id
        // For now, we simulate fetching the specific record:
        // const { data } = await api.get(`/therapy/assignment/${id}`);
        
        // --- MOCK FETCH (Replace with real API call) ---
        // Simulating the data structure your backend sends
        const mockData = {
             _id: id,
             gameId: 'p-001', // Space Pursuits
             gameName: 'Space Pursuits',
             settings: {
                 duration: 180, // Doctor set 3 mins
                 speed: 8,      // Doctor set High Speed
                 contrast: 100,
                 depthEnabled: true,
                 dichopticEnabled: false
             },
             clinicalNote: "Focus on smooth pursuit, not saccades."
        };
        // -----------------------------------------------

        // 2. Load the Game Component
        const protocolDef = getProtocol(mockData.gameId);
        
        if (!protocolDef) {
            throw new Error("Game Protocol definition not found in registry.");
        }

        setAssignment(mockData);
        setActiveComponent(() => protocolDef.component);
        
        // 3. Apply Doctor's Settings
        setTimeLeft(mockData.settings.duration);
        setLoading(false);

      } catch (error) {
        console.error("Failed to load session:", error);
        toast.error("Could not load prescription details.");
        navigate('/patient/dashboard');
      }
    };

    fetchAssignment();
  }, [id, navigate]);

  // 2. TIMER LOGIC
  useEffect(() => {
    let interval;
    if (isPlaying && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                handleSessionComplete();
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, timeLeft]);

  // 3. HANDLERS
  const togglePause = () => setIsPaused(!isPaused);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSessionComplete = () => {
    setIsPlaying(false);
    setIsPaused(true);
    setShowReport(true); 
  };

  const handleAbort = () => {
      if(window.confirm("Abort current therapy session?")) {
          navigate('/patient/dashboard');
      }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-cyan-500 font-mono">
          <FaBrain className="animate-pulse text-4xl mb-4" />
          <p className="tracking-[0.5em] text-sm font-bold">CALIBRATING OCULAR SENSORS...</p>
      </div>
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col font-sans select-none">
      
      {/* --- HUD HEADER --- */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-start pointer-events-none">
        
        {/* Left: Protocol Identity */}
        <div className="flex flex-col">
            <h1 className="text-white font-bold text-lg tracking-widest uppercase drop-shadow-md">
                {assignment?.gameName}
            </h1>
            <div className="flex items-center gap-2 text-cyan-500 text-xs font-bold font-mono">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                ACTIVE PRESCRIPTION
            </div>
        </div>

        {/* Center: Timer */}
        <div className={`flex flex-col items-center transition-colors duration-500 ${timeLeft < 30 ? 'text-red-500' : 'text-cyan-400'}`}>
            <div className="text-4xl font-mono font-bold tracking-wider drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                {formatTime(timeLeft)}
            </div>
        </div>

        {/* Right: Score */}
        <div className="flex flex-col items-end text-right">
            <div className="text-white font-mono font-bold text-xl">{score.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-gray-400 font-bold">Index</div>
        </div>
      </div>

      {/* --- THE GAME CONTAINER --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black/50">
        
        {/* ✅ INJECTING THE CONFIG INTO THE GAME */}
        {!isPaused && ActiveComponent ? (
            <ActiveComponent 
                onScore={(pts) => setScore(s => s + pts)}
                onMiss={() => setAccuracy(a => Math.max(0, a - 2))}
                
                // 🔥 THE MAGIC: Passing Doctor's Settings
                config={assignment.settings} 
                difficulty={assignment.settings.speed} // Backwards compatibility
            />
        ) : null}

        {/* Pause Overlay */}
        {isPaused && !showReport && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center animate-fadeIn">
                <div className="text-center max-w-lg">
                    <h2 className="text-white text-3xl font-bold tracking-widest uppercase mb-4">Ready to Begin?</h2>
                    
                    {/* Display Clinical Parameters */}
                    <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Duration</span>
                            <span className="text-white font-mono">{Math.floor(assignment.settings.duration/60)} Mins</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold block">Intensity</span>
                            <span className="text-cyan-400 font-mono">Level {assignment.settings.speed}</span>
                        </div>
                        <div className="col-span-2">
                             <span className="text-[10px] text-gray-500 uppercase font-bold block">Doctor's Note</span>
                             <p className="text-gray-300 text-sm italic">"{assignment.clinicalNote}"</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setIsPaused(false); setIsPlaying(true); }}
                        className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center gap-3 mx-auto"
                    >
                        <FaPlay /> START SESSION
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* --- FOOTER CONTROLS --- */}
      <div className="absolute bottom-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center pointer-events-auto bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center gap-4">
            <button onClick={togglePause} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                {isPaused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={handleAbort} className="w-10 h-10 rounded-full border border-red-900 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <FaStop />
            </button>
        </div>
        <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* REPORT MODAL */}
      <SessionReportModal 
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          data={{
              protocolName: assignment?.gameName,
              score: score,
              accuracy: accuracy,
              duration: assignment.settings.duration - timeLeft
          }}
      />

    </div>
  );
};

export default TherapySessionPage;