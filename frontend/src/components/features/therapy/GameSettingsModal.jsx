import React, { useState } from 'react';
import { api } from '../../../hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { FaTimes, FaSave, FaSlidersH, FaClock, FaEye } from 'react-icons/fa';

const GameSettingsModal = ({ isOpen, onClose, patientId, game, currentSettings }) => {
  if (!isOpen) return null;

  // --- Form State ---
  // Initialize with existing settings or defaults
  const [formData, setFormData] = useState({
    duration: currentSettings?.duration || 300, // 5 mins
    difficulty: currentSettings?.difficulty || 'medium',
    speed: currentSettings?.speed || 5,
    targetSize: currentSettings?.targetSize || 5,
    depthEnabled: currentSettings?.depthEnabled || false,
    dichopticEnabled: currentSettings?.dichopticEnabled || false,
    clinicalNote: currentSettings?.clinicalNote || '',
  });

  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct the payload matching your Backend Schema
      const payload = {
        patientId,
        gameId: game.id,
        gameName: game.title,
        settings: {
            duration: Number(formData.duration),
            difficulty: formData.difficulty,
            speed: Number(formData.speed),
            targetSize: Number(formData.targetSize),
            depthEnabled: formData.depthEnabled,
            dichopticEnabled: formData.dichopticEnabled
        },
        clinicalNote: formData.clinicalNote
      };

      await api.post('/therapy/assign', payload);
      toast.success(`Prescription saved for ${game.title}`);
      onClose(); // Close modal
    } catch (error) {
      console.error(error);
      toast.error("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">{game.thumbnail}</span> {game.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure Therapy Parameters</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <FaTimes size={20} />
          </button>
        </div>

        {/* --- Body (Scrollable) --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* 1. Duration & Difficulty */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaClock className="text-blue-500" /> Duration (Seconds)
                    </label>
                    <input 
                        type="number" 
                        name="duration" 
                        value={formData.duration} 
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaSlidersH className="text-purple-500" /> Difficulty
                    </label>
                    <select 
                        name="difficulty" 
                        value={formData.difficulty} 
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            {/* 2. Sliders (Speed & Size) */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Speed</label>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{formData.speed}/10</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" name="speed"
                        value={formData.speed} onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    />
                </div>
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Size</label>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">{formData.targetSize}/10</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" name="targetSize"
                        value={formData.targetSize} onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-600"
                    />
                </div>
            </div>

            {/* 3. Advanced Toggles (3D / Dichoptic) */}
            <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" name="depthEnabled"
                        checked={formData.depthEnabled} onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Enable 3D Depth (Z-Axis)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                        type="checkbox" name="dichopticEnabled"
                        checked={formData.dichopticEnabled} onChange={handleChange}
                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        Enable Dichoptic Mode <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Red/Blue Glasses</span>
                    </span>
                </label>
            </div>

            {/* 4. Audit Trail Note */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clinical Justification (Audit Log)
                </label>
                <textarea 
                    name="clinicalNote"
                    value={formData.clinicalNote}
                    onChange={handleChange}
                    placeholder="e.g. Increasing speed as patient reaction time has improved..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white h-24 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

        </div>

        {/* --- Footer --- */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Saving...' : <><FaSave /> Save Prescription</>}
            </button>
        </div>

      </div>
    </div>
  );
};

export default GameSettingsModal;