import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      icon: Users,
      title: 'Total Clients',
      value: '247',
      change: '+12%',
      changeType: 'positive',
      color: 'bg-[#3b82f6]'
    },
    {
      icon: Calendar,
      title: 'This Week',
      value: '18',
      subtitle: 'Appointments',
      change: '+8%',
      changeType: 'positive',
      color: 'bg-[#10b981]'
    },
    {
      icon: DollarSign,
      title: 'Revenue',
      value: '$24,500',
      subtitle: 'This Month',
      change: '+15%',
      changeType: 'positive',
      color: 'bg-[#f59e0b]'
    },
    {
      icon: TrendingUp,
      title: 'Success Rate',
      value: '94%',
      subtitle: 'Cases Won',
      change: '+2%',
      changeType: 'positive',
      color: 'bg-[#8b5cf6]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg shadow-md`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-[#334155] mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-[#334155]">{stat.title}</p>
            {stat.subtitle && (
              <p className="text-xs text-[#64748b]">{stat.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;