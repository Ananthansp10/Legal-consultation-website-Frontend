import React from 'react';
import { Calendar, Users, FileText, Search } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 1,
      title: 'Book New Consultation',
      description: 'Schedule a meeting with a lawyer',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 2,
      title: 'View All Lawyers',
      description: 'Browse our expert legal team',
      icon: Users,
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      id: 3,
      title: 'Manage Documents',
      description: 'Upload and organize your files',
      icon: FileText,
      color: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      id: 4,
      title: 'Legal Resources',
      description: 'Access helpful legal information',
      icon: Search,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-700 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className={`${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left group`}
            >
              <div className="flex flex-col items-start">
                <div className="bg-white/20 p-3 rounded-lg mb-4 group-hover:bg-white/30 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;