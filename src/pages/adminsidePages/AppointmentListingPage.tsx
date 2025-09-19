import React, { useEffect } from 'react';
import { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getAppointments } from '../../services/admin/adminService';
import Pagination from '../../components/reusableComponents/Pagination';

interface Appointment {
  userName: string;
  lawyerName: string;
  date: string;
  time: string;
  specialization: string;
  problem: string;
  appointmentStatus: 'Pending' | 'Accepted' | 'Booked' | 'Completed' | 'Completed' | 'Cancelled' | 'Rejected';
  userProfileImage: string;
  lawyerProfileImage: string;
}

const getStatusConfig = (status: Appointment['appointmentStatus']) => {
  const configs = {
    Pending: {
      text: 'Pending',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      icon: <AlertCircle className="w-4 h-4" />
    },
    Accepted: {
      text: 'Accepted',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      icon: <CheckCircle className="w-4 h-4" />
    },
    Booked: {
      text: 'Booked',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      icon: <Calendar className="w-4 h-4" />
    },
    Completed: {
      text: 'Completed',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      icon: <CheckCircle className="w-4 h-4" />
    },
    Cancelled: {
      text: 'Cancelled',
      textColor: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: <XCircle className="w-4 h-4" />
    },
    Rejected: {
      text: 'Rejected',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-100',
      icon: <XCircle className="w-4 h-4" />
    }
  };
  return configs[status];
};

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const statusConfig = getStatusConfig(appointment.appointmentStatus);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
      {/* Status Badge */}
      <div className="flex justify-end mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.textColor} ${statusConfig.bgColor}`}>
          {statusConfig.icon}
          {statusConfig.text}
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex -space-x-2">
          <img
            src={appointment.userProfileImage}
            alt={appointment.userName}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
          <img
            src={appointment.lawyerProfileImage}
            alt={appointment.lawyerName}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {appointment.userName} & {appointment.lawyerName}
          </h3>
          <p className="text-sm text-blue-600 font-medium">
            {appointment.specialization}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-4"></div>

      {/* Appointment Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{appointment.date}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{appointment.time}</span>
        </div>
        
        <div className="flex items-start gap-3 text-gray-600">
          <User className="w-4 h-4 mt-0.5" />
          <span className="text-sm leading-relaxed">{appointment.problem}</span>
        </div>
      </div>
    </div>
  );
};

function AppointmentListingPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | Appointment['appointmentStatus']>('All');
  const [appointments,setAppointments]=useState<Appointment[]>([])

  useEffect(()=>{
    getAppointments(activeFilter).then((response)=>{
      setAppointments(response.data.data)
    })
  },[activeFilter])

  const [currentPage,setCurrentPage]=useState(1)
  const itemsPerPage=3
  const totalPages=Math.ceil(appointments.length/itemsPerPage)
  const startIndex=(currentPage-1) * itemsPerPage
  const endIndex=startIndex + itemsPerPage
  const data=appointments.slice(startIndex,endIndex)

  const filterTabs = [
    { key: 'All' as const, label: 'All'},
    { key: 'Pending' as const, label: 'Pending'},
    { key: 'Accepted' as const, label: 'Accepted'},
    { key: 'Booked' as const, label: 'Booked'},
    { key: 'Cancelled' as const, label: 'Cancelled'},
    { key: 'Rejected' as const, label: 'Rejected'}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto mt-5">
        {/* Main Container Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Appointments
            </h1>
            <p className="text-gray-600 text-lg">
              View all appointments and their status
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === tab.key
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105'
                  }`}
                >
                  {tab.label}
                  {/* {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )} */}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
              />
            ))}
          </div>

          {/* Empty State (if no appointments) */}
          {appointments?.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeFilter === 'All' ? 'No appointments found' : `No ${activeFilter} appointments`}
              </h3>
              <p className="text-gray-600">
                {activeFilter === 'All' 
                  ? "You don't have any appointments scheduled at the moment."
                  : `There are no ${activeFilter} appointments to display.`
                }
              </p>
            </div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      </div>
    </div>
  );
}

export default AppointmentListingPage;