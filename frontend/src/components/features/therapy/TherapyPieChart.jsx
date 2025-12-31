import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TherapyPieChart = ({ data }) => {
  // Mock Data generation if empty
  const chartData = data && data.length > 0 ? data : [
    { name: 'Oculomotor', value: 30 },
    { name: 'Saccades', value: 45 },
    { name: 'Memory', value: 15 },
    { name: 'Peripheral', value: 10 },
  ];

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="w-full h-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_purple] animate-pulse"></span>
          Therapy Distribution
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#050505', borderColor: '#333', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-gray-400 text-[10px] uppercase font-bold ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TherapyPieChart;