import React from 'react';
import { Calendar, Clock, Video, RotateCcw } from 'lucide-react';

interface Appointment {
  id: number;
  lawyerName: string;
  lawyerImage: string;
  date: string;
  time: string;
  mode: 'Online' | 'Offline';
  specialty: string;
}

const UpcomingAppointments: React.FC = () => {
  const appointments: Appointment[] = [
    {
      id: 1,
      lawyerName: 'Sarah Johnson',
      lawyerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: 'Today',
      time: '2:00 PM',
      mode: 'Online',
      specialty: 'Corporate Law'
    },
    {
      id: 2,
      lawyerName: 'Michael Chen',
      lawyerImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: 'Tomorrow',
      time: '10:30 AM',
      mode: 'Offline',
      specialty: 'Family Law'
    },
    {
      id: 3,
      lawyerName: 'Emily Rodriguez',
      lawyerImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: 'Dec 15',
      time: '3:15 PM',
      mode: 'Online',
      specialty: 'Criminal Defense'
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-700">Upcoming Appointments</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={appointment.lawyerImage}
                  alt={appointment.lawyerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-slate-700">{appointment.lawyerName}</h3>
                  <p className="text-sm text-slate-500">{appointment.specialty}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {appointment.mode === 'Online' && (
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Video className="w-4 h-4" />
                    <span>Join Meeting</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;