import React, { useState, useEffect } from 'react';
import { api } from '../../../hooks/useGetCurrentUser'; 
import { GameForms } from '../../../protocols/forms'; // <--- Import the definitions
import { FaTimes, FaSave, FaGamepad } from 'react-icons/fa';

const GameSettingsModal = ({ isOpen, onClose, patientId, game, currentSettings }) => {
  if (!isOpen || !game) return null;

  // 1. Get the fields. If game.id is "space-pursuits", this will now work!
  const formFields = GameForms[game.id] || [];

  const [formData, setFormData] = useState({
    duration: 300,
    specificConfig: {} 
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (game.id) {
      const initialConfig = {};
      formFields.forEach(field => {
        initialConfig[field.name] = currentSettings?.config?.[field.name] ?? field.defaultValue;
      });
      setFormData({
        duration: currentSettings?.duration || 300,
        specificConfig: initialConfig
      });
    }
  }, [game.id, currentSettings]);

  const handleConfigChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      specificConfig: { ...prev.specificConfig, [name]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/therapy/assign', {
        patientId,
        gameId: game.id,
        gameName: game.name || game.title,
        duration: Number(formData.duration),
        specificConfig: formData.specificConfig // Sends the JSON
      });
      alert("Prescription Saved!");
      onClose();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-3">
            <FaGamepad className="text-cyan-400 text-xl" />
            <h2 className="text-xl font-bold text-white">{game.name || game.title} Configuration</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><FaTimes /></button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Universal Duration */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Session Duration (Seconds)</label>
            <input 
              type="number" 
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          <hr className="border-slate-800 mb-8" />

          {/* DYNAMIC FIELDS RENDERER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">{field.label}</label>
                
                {field.type === 'slider' && (
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min={field.min} max={field.max} 
                      value={formData.specificConfig[field.name] || field.min}
                      onChange={(e) => handleConfigChange(field.name, Number(e.target.value))}
                      className="flex-1 accent-cyan-500"
                    />
                    <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-cyan-400 min-w-[30px] text-center">
                      {formData.specificConfig[field.name]}
                    </span>
                  </div>
                )}

                {field.type === 'number' && (
                  <input 
                    type="number"
                    min={field.min} max={field.max}
                    value={formData.specificConfig[field.name] || 0}
                    onChange={(e) => handleConfigChange(field.name, Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                  />
                )}

                {field.type === 'toggle' && (
                  <button
                    onClick={() => handleConfigChange(field.name, !formData.specificConfig[field.name])}
                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.specificConfig[field.name] ? 'bg-cyan-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.specificConfig[field.name] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                )}
                
                {field.type === 'select' && (
                   <select 
                      value={formData.specificConfig[field.name]}
                      onChange={(e) => handleConfigChange(field.name, e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                   >
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                )}
              </div>
            ))}
          </div>
          
          {formFields.length === 0 && (
             <div className="text-center text-slate-500 mt-10">
                <p>No specific settings found for ID: <span className="font-mono text-cyan-500">{game.id}</span></p>
                <p className="text-xs mt-2">Check protocols/forms.js keys.</p>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancel</button>
          <button 
             onClick={handleSubmit} 
             disabled={loading}
             className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded shadow-lg flex items-center gap-2"
          >
             {loading ? 'Saving...' : <><FaSave /> Assign</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default GameSettingsModal;