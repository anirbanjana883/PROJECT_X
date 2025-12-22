import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT ADDED
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { api } from '../../hooks/useGetCurrentUser';
import { FaSpinner, FaUserMd, FaUserInjured, FaSearch, FaUserPlus, FaChartBar } from 'react-icons/fa';

const DoctorDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate(); // <-- 2. HOOK ADDED
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/doctor/my-patients');
        setPatients(data.patients);
      } catch (error) {
        console.error("Failed to fetch patients", error);
        // Fallback Mock Data for testing UI if API fails
        if (patients.length === 0) {
             setPatients([
                 {_id: '1', name: 'Test Patient', email: 'patient@test.com'},
             ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // --- 3. HANDLER ADDED ---
  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patient/${patientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* --- Animated Background --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Doctor Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, <span className="text-purple-600 dark:text-purple-400 font-semibold drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]">Dr. {user?.name}</span>
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
          <FaUserPlus /> Add New Patient
        </button>
      </div>

      {/* --- Patient List & Search --- */}
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-3xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Patients ({patients.length})</h2>
            
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
                </div>
                <input 
                type="text"
                placeholder="Search patients..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                />
            </div>
        </div>

        <div className="overflow-hidden">
          {loading ? (
            <div className="h-60 flex items-center justify-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700/50">
              {patients.map((patient) => (
                <li key={patient._id} className="group p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors duration-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 dark:text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 dark:group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
                      <FaUserInjured size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* --- 4. CLICK HANDLER RESTORED --- */}
                  <button 
                    onClick={() => handleViewPatient(patient._id)}
                    className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline group-hover:translate-x-1 transition-transform flex items-center gap-1.5"
                  >
                    View Progress <FaChartBar />
                  </button>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
};

export default DoctorDashboard;