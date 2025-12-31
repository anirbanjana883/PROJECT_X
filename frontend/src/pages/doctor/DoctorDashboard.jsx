import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { useMyPatients } from '../../hooks/useMyPatients'; // ✅ Import Hook
import { 
    FaUserInjured, FaSearch, FaBell, FaChartLine, FaUserPlus, FaChevronRight 
} from 'react-icons/fa';

const DoctorDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  
  // ✅ Fetch Real Patients
  const { patients, loading } = useMyPatients();

  if (loading) return (
     <div className="h-screen bg-black flex items-center justify-center text-cyan-500 font-mono animate-pulse">
        LOADING PATIENT ROSTER...
     </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      
      {/* --- 1. TOP HEADER --- */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-white">
                    Dr. {user?.name?.split(' ')[1] || user?.name}
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                    Neuro-Ophthalmology Unit
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FaBell className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600"></div>
            </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashboardCard 
                label="Total Patients" 
                value={patients.length} 
                icon={<FaUserInjured />} 
                color="cyan" 
            />
            <DashboardCard 
                label="Critical Alerts" 
                value="2" 
                icon={<FaBell />} 
                color="red" 
            />
            <DashboardCard 
                label="Weekly Improvement" 
                value="+14%" 
                icon={<FaChartLine />} 
                color="green" 
            />
        </div>

        {/* Patient List Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
                <FaClipboardListIcon /> Patient Roster
            </h2>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <FaSearch className="absolute left-3 top-3 text-gray-500 text-xs" />
                    <input 
                        type="text" 
                        placeholder="Search by name or ID..." 
                        className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                    <FaUserPlus /> Add New
                </button>
            </div>
        </div>

        {/* --- 3. THE PATIENT TABLE --- */}
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-900/50 text-gray-500 font-mono text-[10px] uppercase tracking-wider border-b border-gray-800">
                    <tr>
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Condition</th>
                        <th className="px-6 py-4">Last Session</th>
                        <th className="px-6 py-4">Compliance</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    
                    {patients.length === 0 ? (
                         <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                No patients assigned yet. Click "Add New" to begin.
                            </td>
                         </tr>
                    ) : (
                        patients.map((patient) => (
                            <tr 
                                key={patient._id} 
                                onClick={() => navigate(`/doctor/patient/${patient._id}`)} // 👈 THE LINK TO THE VIEW
                                className="group hover:bg-gray-900/40 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:border-cyan-500 group-hover:text-cyan-500 transition-colors">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                {patient.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                ID: {patient._id.substring(0, 6)}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {patient.condition || "General Therapy"}
                                </td>

                                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                    {/* Mock date if real one missing */}
                                    {patient.lastLogin ? new Date(patient.lastLogin).toLocaleDateString() : "Never"}
                                </td>

                                <td className="px-6 py-4">
                                    {/* Compliance Badge */}
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        (patient.compliance || 100) > 80 
                                        ? 'bg-green-900/20 text-green-500' 
                                        : 'bg-orange-900/20 text-orange-500'
                                    }`}>
                                        {patient.compliance || "New"}%
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <FaChevronRight className="inline-block text-gray-600 group-hover:text-cyan-500 transition-transform group-hover:translate-x-1" size={12} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---
const DashboardCard = ({ label, value, icon, color }) => (
    <div className={`bg-[#0A0A0A] border border-gray-800 p-6 rounded-2xl flex items-center justify-between group hover:border-${color}-500/30 transition-all`}>
        <div>
            <div className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-bold text-white group-hover:text-white transition-colors">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-${color}-900/10 border border-${color}-500/20 flex items-center justify-center text-${color}-500 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
    </div>
);

const FaClipboardListIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
);

export default DoctorDashboard;