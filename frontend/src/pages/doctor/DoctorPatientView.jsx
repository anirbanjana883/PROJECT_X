import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaUserInjured, FaArrowLeft, FaChartLine, FaClipboardList, 
    FaPrescriptionBottleAlt, FaHistory, FaTrophy, FaBolt, FaPlay 
} from 'react-icons/fa';

// --- COMPONENTS ---
import ActivityGraph from '../../components/features/therapy/ActivityGraph'; 
import TherapyPieChart from '../../components/features/therapy/TherapyPieChart'; 
import PatientDetailsCard from '../../components/features/doctor/PatientDetailsCard'; 
import GameSettingsModal from '../../components/features/therapy/GameSettingsModal';

// ✅ IMPORT THE HOOKS (Reuse logic!)
import { usePatientHistory } from '../../hooks/usePatientHistory';
import { api } from '../../hooks/useGetCurrentUser'; // To fetch patient details

const DoctorPatientView = () => {
  const { patientId } = useParams(); // URL param: /doctor/patient/:patientId
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview'); 
  const [patient, setPatient] = useState(null);
  
  // ✅ USE THE HOOK FOR REAL GRAPHS
  const { history, stats, loading: historyLoading } = usePatientHistory(patientId);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // --- FETCH PATIENT DETAILS (Name, Age, etc.) ---
  useEffect(() => {
    const fetchPatientDetails = async () => {
        try {
            // Assuming you have an endpoint for single user details
            const { data } = await api.get(`/users/${patientId}`);
            setPatient(data); 
        } catch (error) {
            console.error("Failed to load patient details", error);
            // Fallback for demo if API fails
            setPatient({ 
                name: "Unknown Patient", 
                condition: "Unknown", 
                id: patientId 
            });
        }
    };
    fetchPatientDetails();
  }, [patientId]);

  // --- MOCK PROTOCOLS (These remain static library items) ---
  const availableProtocols = [
    { id: 'p-001', title: 'Space Pursuits', category: 'Neuro-Ophthalmology', description: '3D Depth tracking.', thumbnail: '🪐' },
    { id: 'p-002', title: 'Jungle Jump', category: 'Saccadic Training', description: 'Rapid eye movement.', thumbnail: '🐸' },
    { id: 'p-003', title: 'Eagle Eye', category: 'Visual Discrimination', description: 'Contrast sensitivity.', thumbnail: '🦅' },
  ];

  const openPrescriptionModal = (game) => {
      setSelectedGame(game);
      setIsModalOpen(true);
  };

  if (!patient || historyLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-cyan-500 font-mono">
        <div className="animate-spin text-4xl mb-4"><FaBolt /></div>
        <p className="animate-pulse tracking-widest text-sm">ACCESSING SECURE RECORDS...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER --- */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/doctor/dashboard')} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800">
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-3 text-white">
                        <FaUserInjured className="text-cyan-500" /> 
                        {patient.name}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider mt-1">
                        <span>ID: {patient._id?.substring(0,6)}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>{patient.condition || "General Therapy"}</span>
                    </div>
                </div>
            </div>
            
            {/* ✅ REAL STATS from the Hook */}
            <div className="hidden md:flex gap-4">
                 <StatBadge icon={<FaTrophy className="text-yellow-500" />} label="Total Sessions" value={stats.totalSessions} />
                 <StatBadge icon={<FaBolt className="text-cyan-500" />} label="Avg Accuracy" value={`${stats.avgAccuracy}%`} />
                 <StatBadge icon={<FaChartLine className="text-green-500" />} label="Peak Score" value={stats.highestScore} />
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-8 mt-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FaChartLine />} label="Overview" />
            <TabButton active={activeTab === 'prescribe'} onClick={() => setActiveTab('prescribe')} icon={<FaPrescriptionBottleAlt />} label="Prescribe" />
            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<FaClipboardList />} label="History" />
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* === TAB 1: OVERVIEW === */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fadeIn">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-[#050505] border border-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FaChartLine className="text-cyan-500" /> Performance Trajectory
                        </h3>
                        {/* ✅ REAL DATA GRAPH */}
                        <div className="h-64 w-full">
                            {history.length > 0 ? (
                                <ActivityGraph data={history} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 italic">No data available</div>
                            )}
                        </div>
                    </div>
                    {/* ... (Pie chart can stay static or be connected similarly) ... */}
                </div>
                <div className="xl:col-span-1">
                    <PatientDetailsCard patient={patient} />
                </div>
            </div>
        )}

        {/* === TAB 2: PRESCRIBE === */}
        {activeTab === 'prescribe' && (
            <div className="animate-fadeIn">
                <div className="bg-[#050505] border border-gray-800 rounded-2xl p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Protocol Library</h2>
                        <p className="text-gray-400 text-sm">Select a therapy module to configure parameters.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableProtocols.map((protocol) => (
                            <div 
                                key={protocol.id} 
                                className="group bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 hover:bg-gray-900/50 transition-all cursor-pointer flex flex-col"
                                onClick={() => openPrescriptionModal(protocol)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-4xl">{protocol.thumbnail}</span>
                                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                        <FaPlay size={12} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{protocol.title}</h3>
                                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider mb-3">{protocol.category}</p>
                                
                                <button className="w-full mt-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                    Configure & Assign
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB 3: HISTORY === */}
        {activeTab === 'history' && (
            <div className="bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden animate-fadeIn">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900/50 text-gray-500 font-mono text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Session Date</th>
                            <th className="px-6 py-4">Game</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {/* ✅ REAL DATA ROWS */}
                        {history.map((log, i) => (
                            <tr key={i} className="hover:bg-gray-900/30">
                                <td className="px-6 py-4 text-gray-300 font-mono text-xs">{log.date}</td>
                                <td className="px-6 py-4 text-white font-bold">{log.game}</td>
                                <td className="px-6 py-4 text-cyan-400 font-mono">{log.score.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.accuracy > 80 ? 'bg-green-900/20 text-green-500' : 'bg-orange-900/20 text-orange-500'}`}>
                                        {log.accuracy}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                                    No therapy sessions recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

      </div>

      <GameSettingsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patientId={patientId} 
          game={selectedGame}   
          currentSettings={{}}  
      />

    </div>
  );
};

// ... Helper Components (TabButton, StatBadge) remain the same ...
const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${active ? 'text-cyan-500 border-cyan-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
        {icon} <span className="hidden sm:inline">{label}</span>
    </button>
);

const StatBadge = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 px-3 py-1.5 rounded-lg">
        <div className="text-sm">{icon}</div>
        <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase font-bold leading-none">{label}</span>
            <span className="text-xs text-white font-bold leading-none mt-0.5">{value}</span>
        </div>
    </div>
);

export default DoctorPatientView;