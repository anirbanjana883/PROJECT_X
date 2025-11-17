import React from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaBrain, FaEye } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* --- ANIMATED BACKGROUND BLOBS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* Blob 1 (Blue) */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-20"></div>
        {/* Blob 2 (Cyan) */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20"></div>
        {/* Blob 3 (Purple) */}
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-20"></div>
      </div>

      {/* --- HERO CONTENT --- */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Glowing Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 backdrop-blur-md animate-float">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-300 tracking-wide uppercase">
            Next Gen Vision Therapy
          </span>
        </div>

        {/* Main Title with Gradient Text */}
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Train Your Eyes. <br />
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Rewire Your Brain.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Experience{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            IndriyaX
          </span>
          . Clinically backed, gamified therapy for Amblyopia & Digital Strain
          using advanced neuroscience.
        </p>

        {/* Buttons with Glow Effects */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/signup"
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] overflow-hidden"
          >
            {/* The Shine Effect Overlay */}
            {/* Note: We use 'group-hover:block' to only show it when hovering, or keep it running if you prefer */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:shimmer-effect"></div>

            <span className="flex items-center gap-2 relative z-10">
              Start Therapy <FaPlay size={14} />
            </span>
          </Link>

          <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl font-bold text-lg transition-all hover:scale-105">
            View Demo
          </button>
        </div>

        {/* --- FEATURE CARDS (Glassmorphism) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <FeatureCard
            icon={<FaBrain className="text-purple-500" />}
            title="Neuroplasticity"
            desc="Leverage your brain's ability to reorganize itself through targeted visual exercises."
          />
          <FeatureCard
            icon={<FaEye className="text-cyan-500" />}
            title="Binocular Training"
            desc="Train both eyes to work together perfectly with dichoptic therapy games."
          />
          <FeatureCard
            icon={<div className="text-blue-500 font-bold">AI</div>}
            title="Smart Progress"
            desc="Algorithms adapt the difficulty in real-time based on your performance."
          />
        </div>
      </div>
    </div>
  );
};

// Helper Component for Glass Cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
    <div className="mb-4 text-3xl p-3 bg-white dark:bg-gray-900 rounded-lg inline-block shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
  </div>
);

export default HomePage;
