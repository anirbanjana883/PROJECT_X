import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-cyan-400 font-bold font-mono text-sm">
          Accuracy: <span className="text-white">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const ActivityGraph = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [{ date: "No Data", accuracy: 0 }];

  return (
    <div className="w-full h-64 sm:h-80">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan] animate-pulse"></span>
          Neural Plasticity Trend
        </h3>
        <span className="text-[10px] font-bold text-cyan-600 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
            LIVE ANALYTICS
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
          
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            minTickGap={30}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8' }}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          <Area
            type="monotone" 
            dataKey="accuracy" 
            stroke="#06b6d4" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAccuracy)" 
            animationDuration={1500}
            className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityGraph;