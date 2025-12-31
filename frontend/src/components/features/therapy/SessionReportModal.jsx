import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaChartLine, FaBrain, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SessionReportModal = ({ isOpen, data, onClose }) => {
  const navigate = useNavigate();
  const [syncState, setSyncState] = useState('syncing'); // syncing | complete | error

  // Simulate Cloud Sync (In real app, this is your API call)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setSyncState('complete');
      }, 2000); // 2-second "fake" sync for effect
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        
        {/* --- Header: Status --- */}
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <FaBrain className="text-cyan-500" /> Session Complete
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
               Protocol: {data.protocolName || "OCULOMOTOR_V3"}
            </p>
          </div>
          
          {/* Sync Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
             syncState === 'syncing' 
             ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500' 
             : 'border-green-500/30 bg-green-500/10 text-green-500'
          }`}>
             {syncState === 'syncing' ? (
                <>
                  <FaCloudUploadAlt className="animate-bounce" /> Syncing Neural Data...
                </>
             ) : (
                <>
                  <FaCheckCircle /> Record Secured
                </>
             )}
          </div>
        </div>

        {/* --- Body: The Metrics Grid --- */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1: Performance Index */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
                <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Performance Index</div>
                <div className="text-4xl font-bold text-white font-mono">{data.score}</div>
                <div className="text-green-500 text-xs font-bold mt-2 flex justify-center items-center gap-1">
                    <FaChartLine /> +12% vs Baseline
                </div>
            </div>

            {/* Metric 2: Accuracy */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
                <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Precision Rate</div>
                <div className={`text-4xl font-bold font-mono ${data.accuracy > 80 ? 'text-cyan-400' : 'text-orange-500'}`}>
                    {data.accuracy}%
                </div>
                <div className="text-gray-600 text-xs mt-2">Target Deviation: 0.4cm</div>
            </div>

            {/* Metric 3: Duration */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
                <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Total Focus Time</div>
                <div className="text-4xl font-bold text-white font-mono">
                    {Math.floor(data.duration / 60)}<span className="text-lg text-gray-500">m</span> {data.duration % 60}<span className="text-lg text-gray-500">s</span>
                </div>
                <div className="text-gray-600 text-xs mt-2">Interruptions: 0</div>
            </div>

        </div>

        {/* --- Footer: Action --- */}
        <div className="p-6 bg-gray-900/80 border-t border-gray-800 flex justify-end gap-4">
            <button 
                onClick={() => onClose()} 
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase text-xs hover:text-white hover:border-gray-500 transition-colors"
            >
                Close Report
            </button>
            <button 
                onClick={() => navigate('/patient/dashboard')} 
                disabled={syncState === 'syncing'}
                className={`px-8 py-3 rounded-xl font-bold uppercase text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all ${
                    syncState === 'syncing' 
                    ? 'bg-gray-800 text-gray-500 cursor-wait' 
                    : 'bg-cyan-600 text-white hover:bg-cyan-500 hover:scale-105'
                }`}
            >
                Return to Dashboard
            </button>
        </div>

      </div>
    </div>
  );
};

export default SessionReportModal;