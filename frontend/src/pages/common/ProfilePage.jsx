import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaEnvelope, FaLock, FaSun, FaMoon, FaDesktop, FaSave, FaCamera, FaUserMd, FaUserShield, FaPhone, FaFingerprint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const { theme, setTheme } = useTheme(); 
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    newPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        toast.success("Identity updated successfully.");
        setIsEditing(false);
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen pt-28 animate-fadeIn">
      
      {/* Header: Tech Vibe */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <FaFingerprint className="text-cyan-500" />
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">User Configuration</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Identity Profile</h1>
        </div>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
                Modify Data
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* --- LEFT COL: Identity Matrix (4 cols) --- */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Main ID Card */}
          <div className="glass-card p-0 overflow-hidden group">
            <div className="h-24 bg-gradient-to-r from-cyan-900 to-blue-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
            
            <div className="px-6 pb-6 -mt-12 text-center relative">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-full h-full rounded-full bg-[#050505] p-1.5 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                            <span className="text-3xl font-bold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    {/* Hover Edit Icon */}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <FaCamera className="text-white" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">{user?.name}</h2>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mb-4">{user?.email}</p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111]">
                    <span className={`w-2 h-2 rounded-full ${user?.role === 'doctor' ? 'bg-purple-500 shadow-[0_0_8px_purple]' : 'bg-cyan-500 shadow-[0_0_8px_cyan]'}`}></span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                        {user?.role} Access
                    </span>
                </div>
            </div>
          </div>

          {/* Interface Settings */}
          <div className="glass-card p-6">
             <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">System Interface</h3>
             <div className="grid grid-cols-3 gap-2">
                <ThemeBtn active={theme === 'light'} onClick={() => setTheme('light')} icon={<FaSun />} label="Light" />
                <ThemeBtn active={theme === 'system'} onClick={() => setTheme('system')} icon={<FaDesktop />} label="Auto" />
                <ThemeBtn active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<FaMoon />} label="Dark" />
             </div>
          </div>
        </div>

        {/* --- RIGHT COL: Data Form (8 cols) --- */}
        <div className="md:col-span-8">
          <div className="glass-card p-8 relative overflow-hidden">
            {/* Decorative Tech Lines */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2 uppercase tracking-wide">
                <FaUser className="text-cyan-500" /> Personal Data
            </h3>
            
            <form onSubmit={handleSave} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                    <InputGroup label="Contact Number" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="+1 (555) 000-0000" />
               </div>
               
               <InputGroup label="Email ID (Locked)" name="email" value={formData.email} disabled={true} icon={<FaEnvelope />} />

               {isEditing && (
                   <div className="pt-8 border-t border-gray-200 dark:border-gray-800 animate-fadeIn">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                        <FaLock className="text-red-500" /> Security Protocol
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••" />
                        <InputGroup label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••" />
                     </div>
                   </div>
               )}

               {isEditing && (
                   <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                     <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Abort</button>
                     <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Processing...' : <><FaSave /> Update Records</>}
                     </button>
                   </div>
               )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Atomic Components ---

const ThemeBtn = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all duration-300 border ${
            active 
            ? 'bg-gray-100 dark:bg-[#111] border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
            : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#111]'
        }`}
    >
        <span className="text-lg mb-1">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
);

const InputGroup = ({ label, type="text", disabled, icon, ...props }) => (
    <div className="w-full group">
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyan-500 transition-colors">
            {label}
        </label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-600">{icon}</div>}
            <input 
                type={type} 
                disabled={disabled}
                className={`input-standard ${icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed bg-transparent border-dashed' : ''}`}
                {...props} 
            />
        </div>
    </div>
);

export default ProfilePage;