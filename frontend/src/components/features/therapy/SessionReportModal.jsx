import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../hooks/useGetCurrentUser'; 
import { FaCheckCircle, FaCloudUploadAlt, FaBrain, FaExclamationTriangle } from 'react-icons/fa';

const SessionReportModal = ({ isOpen, data, onClose }) => {
  const navigate = useNavigate();
  const [syncState, setSyncState] = useState('idle'); // idle | syncing | complete | error

  useEffect(() => {
    if (isOpen && syncState === 'idle') {
      saveSessionToBackend();
    }
  }, [isOpen]);

  const saveSessionToBackend = async () => {
    setSyncState('syncing');
    try {
      const payload = {
        assignmentId: data.assignmentId,
        gameId: data.gameId,
        gameName: data.gameName,
        startTime: new Date(Date.now() - (data.duration * 1000)).toISOString(), 
        endTime: new Date().toISOString(),
        durationSeconds: data.duration,
        score: data.score,
        accuracy: data.accuracy,
        status: 'completed'
      };

      await api.post('/therapy/log', payload);
      setSyncState('complete');
    } catch (error) {
      console.error("Save failed:", error);
      setSyncState('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaBrain className="text-cyan-500" /> Session Complete
           </h2>
           
           <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${
              syncState === 'syncing' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' :
              syncState === 'error' ? 'text-red-500 border-red-500/30 bg-red-500/10' :
              'text-green-500 border-green-500/30 bg-green-500/10'
           }`}>
              {syncState === 'syncing' && <><FaCloudUploadAlt className="animate-bounce"/> Saving...</>}
              {syncState === 'complete' && <><FaCheckCircle /> Saved</>}
              {syncState === 'error' && <><FaExclamationTriangle /> Save Failed</>}
           </div>
        </div>

        {/* Metrics Body */}
        <div className="p-8 grid grid-cols-3 gap-6">
           <MetricBox label="Score" value={data.score} color="text-white" />
           <MetricBox label="Accuracy" value={`${Math.round(data.accuracy)}%`} color={data.accuracy > 80 ? 'text-cyan-400' : 'text-orange-500'} />
           <MetricBox label="Time" value={`${Math.floor(data.duration / 60)}m ${data.duration % 60}s`} color="text-gray-300" />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-900/80">
            {syncState === 'error' && (
                <button onClick={saveSessionToBackend} className="btn-secondary text-red-400 hover:text-red-300">
                    Retry Save
                </button>
            )}
            <button 
                onClick={() => navigate('/patient/dashboard')} 
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all"
            >
                Return to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, color }) => (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 text-center">
        <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">{label}</div>
        <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
    </div>
);

export default SessionReportModal;