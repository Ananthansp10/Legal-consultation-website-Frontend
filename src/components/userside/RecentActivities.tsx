import React from 'react';
import { MessageCircle, Upload, CheckCircle, Bell } from 'lucide-react';

interface Activity {
  id: number;
  type: 'message' | 'document' | 'appointment' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  lawyer?: string;
}

const RecentActivities: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      type: 'message',
      title: 'New message from Sarah Johnson',
      description: 'Regarding your contract review case',
      timestamp: '2 hours ago',
      lawyer: 'Sarah Johnson'
    },
    {
      id: 2,
      type: 'document',
      title: 'Document uploaded successfully',
      description: 'Contract_Draft_v2.pdf has been uploaded',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Appointment confirmed',
      description: 'Meeting with Michael Chen scheduled for tomorrow',
      timestamp: '1 day ago',
      lawyer: 'Michael Chen'
    },
    {
      id: 4,
      type: 'notification',
      title: 'Payment receipt',
      description: 'Consultation fee payment processed',
      timestamp: '2 days ago'
    },
    {
      id: 5,
      type: 'message',
      title: 'New message from Emily Rodriguez',
      description: 'Case update and next steps',
      timestamp: '3 days ago',
      lawyer: 'Emily Rodriguez'
    }
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'document':
        return Upload;
      case 'appointment':
        return CheckCircle;
      case 'notification':
        return Bell;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'document':
        return 'bg-green-100 text-green-600';
      case 'appointment':
        return 'bg-purple-100 text-purple-600';
      case 'notification':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-700">Recent Activities</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = getIcon(activity.type);
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/20 hover:shadow-md transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${getIconColor(activity.type)}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-700 truncate">{activity.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-2">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;