import React, { useState } from 'react';
import { api } from '../../../hooks/useGetCurrentUser';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTimes, FaUser, FaEnvelope, FaLock, FaVenusMars, FaBirthdayCake } from 'react-icons/fa';

const AddPatientModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // In real apps, you might auto-generate this
    age: '',
    gender: 'Male',
    condition: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send Data to Backend
      // Note: Ensure your backend supports doctors creating users, 
      // or use the public signup endpoint if that's how your logic works.
      await api.post('/auth/register', {
        ...formData,
        role: 'patient' // Force role to patient
      });

      toast.success(`Patient ${formData.name} created successfully!`);
      
      // 2. Refresh the list in the parent component
      if (onSuccess) onSuccess();
      
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create patient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      
      <div className="glass-card w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#111]/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaUserPlus className="text-cyan-500" /> Onboard New Patient
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
            
            {/* Name */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="input-standard pl-10"
                        placeholder="e.g. Sarah Connor"
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                    <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        className="input-standard pl-10"
                        placeholder="patient@example.com"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Temporary Password</label>
                <div className="relative">
                    <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="text" name="password" required
                        value={formData.password} onChange={handleChange}
                        className="input-standard pl-10 font-mono"
                        placeholder="Generate a password..."
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Age</label>
                    <div className="relative">
                        <FaBirthdayCake className="absolute left-4 top-3.5 text-gray-400" />
                        <input 
                            type="number" name="age"
                            value={formData.age} onChange={handleChange}
                            className="input-standard pl-10"
                            placeholder="Age"
                        />
                    </div>
                </div>
                {/* Gender */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gender</label>
                    <div className="relative">
                        <FaVenusMars className="absolute left-4 top-3.5 text-gray-400" />
                        <select 
                            name="gender" 
                            value={formData.gender} onChange={handleChange}
                            className="input-standard pl-10 appearance-none"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

             {/* Condition */}
             <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Diagnosis / Condition</label>
                <input 
                    type="text" name="condition"
                    value={formData.condition} onChange={handleChange}
                    className="input-standard"
                    placeholder="e.g. Amblyopia (Left Eye)"
                />
            </div>

        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]/50 flex justify-end gap-3">
            <button onClick={onClose} className="btn-secondary">
                Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? 'Creating...' : 'Create Patient Account'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddPatientModal;