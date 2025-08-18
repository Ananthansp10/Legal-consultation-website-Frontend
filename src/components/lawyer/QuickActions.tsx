import React from 'react';
import { Calendar, Clock, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 1,
      title: 'Start New Appointment',
      description: 'Schedule a consultation',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'View Calendar',
      description: 'Check your schedule',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 3,
      title: 'Add Availability',
      description: 'Manage your time slots',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 4,
      title: 'Send Quick Message',
      description: 'Communicate with clients',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const navigate=useNavigate()

  function navigateLinks(link:string){
    if(link=='View Calendar'){
      navigate('/lawyer/slot-list-page')
    }
    if(link=='Add Availability'){
      navigate('/lawyer/add-availablity')
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={()=>navigateLinks(action.title)}
              className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:bg-white/90 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{action.title}</h3>
              <p className="text-sm text-slate-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;