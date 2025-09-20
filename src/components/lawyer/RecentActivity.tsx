import React from 'react';
import { User, Calendar, MessageSquare, Bell } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'login',
      title: 'You logged in to your account',
      time: '2 hours ago',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 2,
      type: 'appointment',
      title: 'New appointment scheduled with Sarah Johnson',
      time: '4 hours ago',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from Michael Chen',
      time: '6 hours ago',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Appointment rescheduled: Contract Review',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 5,
      type: 'notification',
      title: 'Platform maintenance scheduled for tonight',
      time: '2 days ago',
      icon: Bell,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 divide-y divide-gray-200/50">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className={`p-4 hover:bg-white/90 transition-colors duration-200 ${index === 0 ? 'rounded-t-xl' : ''
                } ${index === activities.length - 1 ? 'rounded-b-xl' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;