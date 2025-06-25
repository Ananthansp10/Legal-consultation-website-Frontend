import React from 'react';
import { Phone, Eye, Clock, MapPin } from 'lucide-react';

const UpcommingAppointments: React.FC = () => {
  const appointments = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '10:00 AM',
      date: 'Today',
      caseTitle: 'Property Dispute Resolution',
      type: 'Video Call',
      status: 'confirmed',
    },
    {
      id: 2,
      clientName: 'Michael Chen',
      clientImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '2:30 PM',
      date: 'Today',
      caseTitle: 'Contract Review & Analysis',
      type: 'In-Person',
      status: 'pending',
    },
    {
      id: 3,
      clientName: 'Emily Rodriguez',
      clientImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '11:00 AM',
      date: 'Tomorrow',
      caseTitle: 'Family Law Consultation',
      type: 'Phone Call',
      status: 'confirmed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Upcoming Appointments</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={appointment.clientImage}
                  alt={appointment.clientName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{appointment.clientName}</h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time} • {appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-slate-800 mb-2">{appointment.caseTitle}</h4>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </button>
              <button className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcommingAppointments;