import React, { useState } from 'react';
import { api } from '../../../hooks/useGetCurrentUser'; // Your axios instance
import { toast } from 'react-toastify';
import { FaUserMd, FaNotesMedical } from 'react-icons/fa';

const TriageForm = ({ user }) => {
  const [formData, setFormData] = useState({
    medicalCondition: user.medicalCondition || '',
    severity: user.severity || 'low'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the backend we just built in Step 1
      await api.put('/users/update-triage', formData);
      toast.success("Profile Updated");
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 text-center animate-fadeIn">
      
      {/* 1. The "Waiting" Message */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-10 mb-8">
        <FaUserMd className="text-5xl text-cyan-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Finding Your Specialist...</h1>
        <p className="text-gray-400">
          You are currently in the <strong>Priority Queue</strong>. 
          Please complete your details so the right doctor can accept you.
        </p>
      </div>

      {/* 2. The Form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-8 text-left">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FaNotesMedical className="text-cyan-500" /> Clinical Intake Form
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Condition</label>
                    <input 
                        type="text" 
                        value={formData.medicalCondition}
                        onChange={(e) => setFormData({...formData, medicalCondition: e.target.value})}
                        placeholder="E.g., Amblyopia, Strabismus..."
                        className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Severity</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['low', 'medium', 'high'].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({...formData, severity: level})}
                                className={`py-3 rounded-lg font-bold capitalize border ${
                                    formData.severity === level 
                                    ? 'bg-cyan-900/30 border-cyan-500 text-cyan-500' 
                                    : 'bg-[#111] border-gray-700 text-gray-500'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
                >
                    {loading ? "Updating..." : "Update Medical Profile"}
                </button>
            </div>
        </form>
      ) : (
        <div className="p-8 bg-green-900/20 border border-green-900 rounded-xl text-green-500">
            Profile Updated! Please wait for a doctor to accept your case.
        </div>
      )}
    </div>
  );
};

export default TriageForm;