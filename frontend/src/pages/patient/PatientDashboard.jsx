import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { useTherapyPlan } from "../../hooks/useTherapyPlan";
import { usePatientHistory } from "../../hooks/usePatientHistory";
import ActivityGraph from "../../components/features/therapy/ActivityGraph";
import TriageForm from "../../components/features/patient/TriageForm";

import {
  FaPlay,
  FaTrophy,
  FaCalendarCheck,
  FaChartLine,
  FaUserMd,
  FaBolt,
} from "react-icons/fa";

// Helper to map Game IDs to Visuals (since DB only stores the ID)
const GAME_ASSETS = {
  "p-001": { color: "cyan", icon: "🪐" }, // Space Pursuits
  "p-002": { color: "green", icon: "🐸" }, // Jungle Jump
  "p-003": { color: "purple", icon: "🦅" }, // Eagle Eye
  default: { color: "gray", icon: "🎮" },
};

const PatientDashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { plan } = useTherapyPlan(user?._id);
  const { history, stats, loading } = usePatientHistory(user?._id);

  if (!user.assignedDoctor) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6">
        {/* Show the Waiting Room Form */}
        <TriageForm user={user} />
      </div>
    );
  }

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-cyan-500 font-mono text-sm tracking-widest animate-pulse">
        LOADING NEURAL INTERFACE...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 pb-20">
      {/* --- 1. HERO HEADER --- */}
      <div className="relative h-64 bg-gradient-to-b from-gray-900 to-[#050505] border-b border-gray-800 overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,#06b6d4_0%,transparent_70%)]"></div>

        <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            Welcome back,{" "}
            <span className="text-cyan-400">{user?.name?.split(" ")[0]}</span>.
          </h1>
          <p className="text-gray-400 max-w-lg text-sm md:text-base">
            Your neural plasticity index is up{" "}
            <span className="text-green-500 font-bold">+12%</span> this week.
            Ready to continue your training?
          </p>

          {/* Quick Stats Row */}
          <div className="flex gap-6 mt-8">
            <StatBadge
              icon={<FaTrophy className="text-yellow-500" />}
              label="Total Sessions"
              value={stats.totalSessions}
            />
            <StatBadge
              icon={<FaBolt className="text-cyan-500" />}
              label="Avg. Accuracy"
              value={`${stats.avgAccuracy}%`}
            />
            <StatBadge
              icon={<FaChartLine className="text-green-500" />}
              label="Best Score"
              value={stats.highestScore.toLocaleString()}
            />
          </div>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: The "Prescribed Protocols" List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FaCalendarCheck className="text-cyan-500" /> Today's Regimen
              </h2>
              <span className="text-xs font-mono text-gray-500 uppercase">
                {plan.length} Active Modules
              </span>
            </div>

            {/* MAPPING THE REAL DATA */}
            {plan.length === 0 ? (
              <div className="p-8 border border-dashed border-gray-800 rounded-2xl text-center text-gray-500">
                No active assignments. Great job!
              </div>
            ) : (
              plan.map((assignment) => {
                const assets =
                  GAME_ASSETS[assignment.gameId] || GAME_ASSETS["default"];

                return (
                  <div
                    key={assignment._id}
                    className="group relative bg-gray-900/40 border border-gray-800 hover:border-cyan-500/50 hover:bg-gray-900/60 transition-all rounded-2xl p-6 overflow-hidden cursor-pointer shadow-lg"
                    onClick={() =>
                      navigate(`/therapy/session/${assignment._id}`, {
                        // 🔥 CRITICAL FIX: Pass the assignment object in 'state'
                        state: {
                          assignmentData: assignment,
                        },
                      })
                    }
                  >
                    {/* Glow Effect */}
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-${assets.color}-500/10 blur-3xl rounded-full group-hover:bg-${assets.color}-500/20 transition-all`}
                    ></div>

                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex gap-4">
                        {/* Icon Box */}
                        <div
                          className={`w-16 h-16 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform`}
                        >
                          {assets.icon}
                        </div>

                        {/* Text Info */}
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {assignment.gameName}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-mono uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                              <FaUserMd className="text-gray-600" /> Dr.{" "}
                              {assignment.doctorId?.name || "Unknown"}
                            </span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span>
                              {Math.floor(assignment.settings?.duration / 60)}{" "}
                              Mins
                            </span>
                          </div>

                          {/* Doctor's Note (Only if present) */}
                          {assignment.clinicalNote && (
                            <div className="mt-3 text-xs text-gray-500 italic border-l-2 border-gray-700 pl-3">
                              "{assignment.clinicalNote}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Play Button */}
                      <button className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-lg group-hover:shadow-cyan-500/50">
                        <FaPlay className="ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: Progress & Stats */}
          <div className="space-y-6">
            {/* Performance Graph Card */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaChartLine /> Performance Trajectory
              </h3>

              {/* The Graph Component now uses REAL database history */}
              <div className="h-48 w-full">
                {history.length > 0 ? (
                  <ActivityGraph data={history} />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-600 italic">
                    No sessions recorded yet. Play a game to see data!
                  </div>
                )}
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                Keep it up!
              </h3>
              <p className="text-sm text-cyan-200/70 relative z-10">
                You are on a 5-day streak. Complete today's Space Pursuits
                session to unlock the "Neuro-Ninja" badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
    <div className="text-lg">{icon}</div>
    <div>
      <div className="text-[10px] text-gray-400 uppercase font-bold leading-none">
        {label}
      </div>
      <div className="text-sm font-bold text-white leading-none mt-1">
        {value}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs font-bold text-gray-400">{label}</span>
      <span className={`text-xs font-bold text-${color}-400`}>{percent}%</span>
    </div>
    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full bg-${color}-500 rounded-full transition-all duration-1000`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

export default PatientDashboard;
