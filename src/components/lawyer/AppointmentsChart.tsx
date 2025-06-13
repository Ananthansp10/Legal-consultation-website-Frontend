import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AppointmentsChart: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Weekly');

  const data = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 8 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 10 },
    { name: 'Fri', appointments: 18 },
    { name: 'Sat', appointments: 6 },
    { name: 'Sun', appointments: 4 },
  ];

  const filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-[#334155]">Appointments Overview</h2>
        <div className="inline-flex gap-2 bg-white/70 backdrop-blur-lg border border-[#e2e8f0] rounded-full p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1 text-sm rounded-full transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'text-[#64748b] hover:bg-[#3b82f6] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px] overflow-x-auto">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AppointmentsChart;