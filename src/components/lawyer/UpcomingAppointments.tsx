import React from 'react';
import { Clock, Calendar, Video, RotateCcw } from 'lucide-react';

const UpcomingAppointments: React.FC = () => {
  const appointments = [
    {
      id: 1,
      clientName: 'Michael Thompson',
      clientImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      date: 'Today',
      time: '2:00 PM',
      type: 'Online',
      matter: 'Contract Review'
    },
    {
      id: 2,
      clientName: 'Emily Rodriguez',
      clientImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      date: 'Tomorrow',
      time: '10:30 AM',
      type: 'In-Person',
      matter: 'Business Formation'
    },
    {
      id: 3,
      clientName: 'David Chen',
      clientImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      date: 'Dec 15',
      time: '3:45 PM',
      type: 'Online',
      matter: 'Legal Consultation'
    },
    {
      id: 4,
      clientName: 'Sarah Williams',
      clientImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      date: 'Dec 16',
      time: '11:00 AM',
      type: 'In-Person',
      matter: 'Property Dispute'
    }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#334155]">Upcoming Appointments</h2>
        <button className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white/50 backdrop-blur-lg rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all duration-300 border border-[#e2e8f0]"
          >
            <div className="flex items-center gap-4">
              <img
                src={appointment.clientImage}
                alt={appointment.clientName}
                className="h-12 w-12 rounded-full border-2 border-[#3b82f6] object-cover"
              />
              <div>
                <h3 className="font-semibold text-[#334155]">{appointment.clientName}</h3>
                <p className="text-sm text-[#64748b]">{appointment.matter}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-[#64748b]">
                    <Calendar className="h-3 w-3" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#64748b]">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {appointment.type === 'Online' ? (
                <button className="bg-[#10b981] text-white px-3 py-1 rounded-md shadow-md hover:scale-105 transition-transform duration-200 text-sm flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  Join
                </button>
              ) : (
                <span className="bg-[#f59e0b] text-white px-3 py-1 rounded-md text-sm">
                  In-Person
                </span>
              )}
              <button className="bg-[#64748b] text-white px-3 py-1 rounded-md shadow-md hover:scale-105 transition-transform duration-200 text-sm flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;