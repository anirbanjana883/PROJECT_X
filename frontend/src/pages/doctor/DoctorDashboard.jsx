import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Needed for table navigation
import { api } from '../../hooks/useGetCurrentUser'; 
import { toast } from 'react-toastify';
import { 
    FaUserPlus, FaUserInjured, FaClipboardList, FaCheckCircle, 
    FaSearch, FaChevronRight 
} from 'react-icons/fa';

import { useMyPatients } from '../../hooks/useMyPatients'; 

const DoctorDashboard = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [viewMode, setViewMode] = useState('my-patients'); 
    const [queue, setQueue] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // --- HOOKS ---
    const { patients, loading: loadingPatients } = useMyPatients(); 

    // --- FETCH QUEUE ---
    const fetchQueue = async () => {
        try {
            const { data } = await api.get('/auth/intake-queue');
            setQueue(data.data);
        } catch (err) {
            console.error("Queue fetch failed", err);
        }
    };

    // Auto-fetch queue when tab is clicked
    useEffect(() => {
        if (viewMode === 'queue') fetchQueue();
    }, [viewMode]);

    // --- CLAIM ACTION ---
    const handleClaim = async (patientId) => {
        try {
            await api.post('/auth/claim-patient', { patientId });
            toast.success("Patient successfully added to your roster!");
            
            // Refresh Queue
            fetchQueue();
            
            // Refresh Roster (Simple reload to re-run useMyPatients)
            window.location.reload(); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to claim patient");
        }
    };

    // Filter patients for search
    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-cyan-500/30">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Doctor Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your patient roster and intake queue.</p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                    <TabButton 
                        active={viewMode === 'my-patients'} 
                        onClick={() => setViewMode('my-patients')}
                        label="My Roster"
                        icon={<FaClipboardList />}
                    />
                    <TabButton 
                        active={viewMode === 'queue'} 
                        onClick={() => setViewMode('queue')}
                        label="Waiting Room"
                        icon={<FaUserPlus />}
                        badge={queue.length} 
                    />
                </div>
            </div>

            {/* =========================================================
                VIEW 1: MY PATIENTS (THE ROSTER)
               ========================================================= */}
            {viewMode === 'my-patients' && (
                <div className="animate-fadeIn">
                    {/* Search Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-400 text-sm">Active Patients: <span className="text-white font-bold">{patients.length}</span></p>
                        
                        <div className="relative w-64">
                            <FaSearch className="absolute left-3 top-3 text-gray-500 text-xs" />
                            <input 
                                type="text" 
                                placeholder="Search patients..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* The Table */}
                    <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-900/50 text-gray-500 font-mono text-[10px] uppercase tracking-wider border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Condition</th>
                                    <th className="px-6 py-4">Severity</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loadingPatients ? (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-cyan-500 animate-pulse">Loading Records...</td></tr>
                                ) : filteredPatients.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">No patients found. Check the Waiting Room!</td></tr>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <tr 
                                            key={patient._id} 
                                            onClick={() => navigate(`/doctor/patient/${patient._id}`)} 
                                            className="group hover:bg-gray-900/40 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-cyan-900 group-hover:text-cyan-400 transition-colors">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-200 group-hover:text-white">{patient.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{patient.medicalCondition || "General"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    patient.severity === 'high' ? 'bg-red-900/20 text-red-500' : 
                                                    patient.severity === 'medium' ? 'bg-orange-900/20 text-orange-500' : 
                                                    'bg-green-900/20 text-green-500'
                                                }`}>
                                                    {patient.severity || 'low'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 group-hover:text-cyan-500 transition-colors">
                                                <FaChevronRight />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* =========================================================
                VIEW 2: WAITING ROOM (THE QUEUE)
               ========================================================= */}
            {viewMode === 'queue' && (
                <div className="animate-fadeIn">
                    <p className="text-gray-400 mb-6 flex items-center gap-2">
                        <FaUserInjured /> Unassigned patients: <span className="text-white font-bold">{queue.length}</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queue.length === 0 ? (
                            <div className="col-span-full py-12 text-center border border-gray-800 rounded-xl bg-gray-900/20">
                                <p className="text-gray-500 italic">No unassigned patients pending.</p>
                            </div>
                        ) : (
                            queue.map((p) => (
                                <QueueCard key={p._id} patient={p} onClaim={() => handleClaim(p._id)} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const TabButton = ({ active, onClick, label, icon, badge }) => (
    <button 
        onClick={onClick}
        className={`relative px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-all ${
            active ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
    >
        {icon} {label}
        {badge > 0 && (
            <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">
                {badge}
            </span>
        )}
    </button>
);

const QueueCard = ({ patient, onClaim }) => (
    <div className="bg-[#0A0A0A] border border-gray-800 p-6 rounded-xl hover:border-cyan-500/50 transition-all group hover:-translate-y-1 hover:shadow-xl">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white">{patient.name}</h3>
            
            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                patient.severity === 'high' ? 'bg-red-900/10 text-red-500 border-red-900/50' : 
                patient.severity === 'medium' ? 'bg-orange-900/10 text-orange-500 border-orange-900/50' : 
                'bg-green-900/10 text-green-500 border-green-900/50'
            }`}>
                {patient.severity}
            </span>
        </div>

        <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500 text-xs uppercase font-bold">Condition</span>
                <span className="text-cyan-400 font-mono">{patient.medicalCondition}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500 text-xs uppercase font-bold">Wait Time</span>
                <span className="text-gray-300 font-mono">
                    {/* Calculate hours waiting */}
                    {Math.max(0, Math.floor((new Date() - new Date(patient.createdAt)) / (1000 * 60 * 60)))} Hrs
                </span>
            </div>
        </div>

        <button 
            onClick={onClaim}
            className="w-full py-3 bg-gray-800 hover:bg-cyan-600 text-white font-bold rounded-lg uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
        >
            <FaCheckCircle /> Accept Patient
        </button>
    </div>
);

export default DoctorDashboard;