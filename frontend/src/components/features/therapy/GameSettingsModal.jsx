import React, { useState } from 'react';
import { api } from '../../../hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { FaTimes, FaSave, FaMicrochip, FaEye, FaSlidersH, FaLayerGroup, FaBrain } from 'react-icons/fa';
import { FiActivity, FiMonitor, FiTarget } from 'react-icons/fi';

const GameSettingsModal = ({ isOpen, onClose, patientId, game, currentSettings }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    duration: currentSettings?.duration || 300,
    speed: currentSettings?.speed || 5,
    targetSize: currentSettings?.size || 5,
    contrast: currentSettings?.contrast || 100,
    colorCombination: currentSettings?.colorCombination || 'none',
    backgroundColor: currentSettings?.backgroundColor || 'black',
    targetType: currentSettings?.targetType || 'dot',
    depthEnabled: currentSettings?.depthEnabled || false,
    dichopticEnabled: currentSettings?.dichopticEnabled || false,
    clinicalNote: currentSettings?.clinicalNote || '',
  });

  const [loading, setLoading] = useState(false);

  // Helper for slider color interpolation
  const getSliderColor = (val, max) => {
    const percentage = (val / max) * 100;
    return `linear-gradient(90deg, #06b6d4 ${percentage}%, #374151 ${percentage}%)`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        patientId,
        gameId: game.id,
        gameName: game.title,
        settings: {
            duration: Number(formData.duration),
            size: Number(formData.targetSize),
            speed: Number(formData.speed),
            contrast: Number(formData.contrast),
            colorCombination: formData.colorCombination,
            backgroundColor: formData.backgroundColor,
            targetType: formData.targetType,
            depthEnabled: formData.depthEnabled,
            dichopticEnabled: formData.dichopticEnabled
        },
        clinicalNote: formData.clinicalNote
      };
      await api.post('/therapy/assign', payload);
      toast.success("Prescription configured successfully.");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Configuration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
      
      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl shadow-cyan-900/20 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        
        {/* Header: Cyber-Medical Look */}
        <div className="bg-slate-900/50 border-b border-slate-700 p-6 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400">
              <FaBrain size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                {game.title} <span className="text-slate-500 font-light">| Protocol Configuration</span>
              </h2>
              <p className="text-xs text-cyan-500 uppercase tracking-widest font-semibold mt-1">
                Neuro-Optometric Module v2.4
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2 rounded-full hover:bg-red-500/10 transition-colors"
          >
            <FaTimes className="text-slate-400 group-hover:text-red-500 transition-colors" size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-[#0F172A] to-[#020617]">
            
            {/* Section 1: Core Metrics Grid */}
            <section>
                <SectionHeader icon={<FiActivity />} title="Core Dynamics" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-6">
                    
                    {/* Duration Input */}
                    <ControlCard label="Session Duration" value={`${Math.floor(formData.duration / 60)}m ${formData.duration % 60}s`}>
                        <input 
                            type="range" min="60" max="1800" step="30" name="duration"
                            value={formData.duration} onChange={handleChange}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-cyan-400"
                            style={{ background: getSliderColor(formData.duration, 1800) }}
                        />
                    </ControlCard>

                    {/* Contrast Input */}
                    <ControlCard label="Visual Contrast" value={`${formData.contrast}%`}>
                        <input 
                            type="range" min="10" max="100" step="5" name="contrast"
                            value={formData.contrast} onChange={handleChange}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-cyan-400"
                            style={{ background: getSliderColor(formData.contrast, 100) }}
                        />
                    </ControlCard>

                    {/* Speed Input */}
                    <ControlCard label="Stimulus Speed" value={`Level ${formData.speed}`}>
                         <div className="flex justify-between text-xs text-slate-500 mb-2 px-1 font-mono">
                            <span>SLOW</span><span>HYPER</span>
                        </div>
                        <input 
                            type="range" min="1" max="10" name="speed"
                            value={formData.speed} onChange={handleChange}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-cyan-400"
                            style={{ background: getSliderColor(formData.speed, 10) }}
                        />
                    </ControlCard>

                    {/* Size Input */}
                    <ControlCard label="Target Size" value={`${formData.targetSize}px Scale`}>
                        <input 
                            type="range" min="1" max="10" name="targetSize"
                            value={formData.targetSize} onChange={handleChange}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-cyan-400"
                            style={{ background: getSliderColor(formData.targetSize, 10) }}
                        />
                    </ControlCard>
                </div>
            </section>

            {/* Section 2: Visual Parameters */}
            <section>
                <SectionHeader icon={<FiMonitor />} title="Visual Environment" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <SelectBox 
                        label="Background Field" 
                        name="backgroundColor" 
                        value={formData.backgroundColor} 
                        onChange={handleChange}
                        options={[
                            { value: 'black', label: 'Deep Space (Black)' },
                            { value: 'white', label: 'Clinical (White)' },
                            { value: 'green', label: 'High Contrast (Green)' }
                        ]} 
                    />
                     <SelectBox 
                        label="Stimulus Type" 
                        name="targetType" 
                        value={formData.targetType} 
                        onChange={handleChange}
                        options={[
                            { value: 'dot', label: 'Gaussian Dot' },
                            { value: 'letter', label: 'Sloan Letters' },
                            { value: 'number', label: 'Numerical' },
                            { value: 'gabor', label: 'Gabor Patch' }
                        ]} 
                    />
                     <SelectBox 
                        label="Dichoptic Filter" 
                        name="colorCombination" 
                        value={formData.colorCombination} 
                        onChange={handleChange}
                        options={[
                            { value: 'none', label: 'Monocular / Binocular' },
                            { value: 'red-green', label: 'Anaglyph (Red/Green)' },
                            { value: 'red-blue', label: 'Anaglyph (Red/Blue)' }
                        ]} 
                    />
                </div>
            </section>

            {/* Section 3: Advanced Therapeutics */}
            <section className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <FaMicrochip className="text-purple-400" />
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Advanced Therapeutics</h3>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    <ToggleSwitch 
                        label="Stereopsis (3D Depth)" 
                        description="Enables Z-axis movement for depth perception training."
                        checked={formData.depthEnabled}
                        name="depthEnabled"
                        onChange={handleChange}
                        color="purple"
                    />
                    <div className="w-px bg-slate-700 hidden md:block"></div>
                    <ToggleSwitch 
                        label="Dichoptic Suppression" 
                        description="Splits visual field to treat amblyopia."
                        checked={formData.dichopticEnabled}
                        name="dichopticEnabled"
                        onChange={handleChange}
                        color="cyan"
                    />
                </div>
            </section>
            
            {/* Clinical Notes */}
            <div className="group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block group-focus-within:text-cyan-400 transition-colors">
                    Clinical Observations / Notes
                </label>
                <textarea 
                    name="clinicalNote"
                    value={formData.clinicalNote}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600 font-mono"
                    rows="2"
                    placeholder="Enter specific protocol instructions or patient notes here..."
                ></textarea>
            </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-900 border-t border-slate-800 p-6 flex justify-end gap-4">
            <button 
                onClick={onClose} 
                className="px-6 py-3 rounded-lg text-slate-400 font-medium hover:text-white hover:bg-slate-800 transition-all text-sm uppercase tracking-wide"
            >
                Cancel Protocol
            </button>
            <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-900/40 transform active:scale-95 transition-all flex items-center gap-2 text-sm uppercase tracking-wide"
            >
                {loading ? <FaSlidersH className="animate-spin" /> : <><FaSave /> Initialize Therapy</>}
            </button>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS for Consistency --- */

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
        <span className="text-cyan-500">{icon}</span>
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{title}</h3>
    </div>
);

const ControlCard = ({ label, value, children }) => (
    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
        <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase group-hover:text-cyan-400 transition-colors">{label}</label>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-900/30">{value}</span>
        </div>
        {children}
    </div>
);

const SelectBox = ({ label, name, value, options, onChange }) => (
    <div className="relative">
        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">{label}</label>
        <div className="relative">
            <select 
                name={name} value={value} onChange={onChange}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-3 appearance-none focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <FaLayerGroup size={12} />
            </div>
        </div>
    </div>
);

const ToggleSwitch = ({ label, description, checked, name, onChange, color }) => (
    <label className="flex items-start gap-4 cursor-pointer group flex-1">
        <div className="relative">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
            <div className={`w-12 h-6 rounded-full transition-colors ${checked ? (color === 'purple' ? 'bg-purple-600' : 'bg-cyan-600') : 'bg-slate-700'}`}></div>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
        <div>
            <span className={`block text-sm font-bold ${checked ? 'text-white' : 'text-slate-400'} group-hover:text-white transition-colors`}>
                {label}
            </span>
            <span className="text-xs text-slate-500 leading-tight block mt-1">{description}</span>
        </div>
    </label>
);

export default GameSettingsModal;