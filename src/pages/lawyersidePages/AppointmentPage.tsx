import { Calendar, Clock, MessageCircle, User, MapPin, Video, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAppointments, updateAppointmentStatus } from '../../services/lawyer/lawyerService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/reusableComponents/ConfirmModal';
import Navbar from '../../components/lawyer/Navbar';

export interface User {
  _id: string;
  name: string;
  profileImage: string;
}

export interface Appointment {
  _id: string;
  user: User;
  problem: string;
  date: string;
  time: string;
  mode: 'online' | 'offline';
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Completed' | 'Cancelled';
}

interface AppointmentCardProps {
  appointment: Appointment;
  setActiveFilter: (filter: string) => void;
}


function AppointmentCard({ appointment,setActiveFilter }:AppointmentCardProps) {
  const getStatusColor = (status:string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status:string) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      case 'Accepted': return <CheckCircle size={16} />;
      case 'Booked': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const [showModal,setShowModal]=useState(false)

  const lawyerId:string | undefined=useSelector((state:RootState)=>state.lawyerAuth.lawyer?._id)

  function updateStatus(id:string,status:string){
    if(status=='Accepted'){
      updateAppointmentStatus(id,status,lawyerId!).then((response)=>{
      toast.success(response.data.message)
      setActiveFilter('Accepted')
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
    }else{
      setShowModal(true)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-6 overflow-hidden">
      <div className="p-6">
        {/* Header with user info and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={appointment.user.profileImage}
              alt={appointment.user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{appointment.user.name}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                {appointment.mode === 'online' ? (
                  <>
                    <Video size={16} className="mr-1" />
                    Online Consultation
                  </>
                ) : (
                  <>
                    <MapPin size={16} className="mr-1" />
                    In-Person Visit
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
            {getStatusIcon(appointment.status)}
            {appointment.status}
          </div>
        </div>

        {/* Problem description */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{appointment.problem}</p>
        </div>

        {/* Date and time info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-2" />
              <span className="font-medium">{appointment.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={18} className="mr-2" />
              <span className="font-medium">{appointment.time}</span>
            </div>
          </div>
        </div>

        {/* Actions - Static display only */}
        {appointment.status === 'Pending' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button onClick={()=>updateStatus(appointment._id,'Accepted')} className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium cursor-default">
              Accept Appointment
            </button>
            <button onClick={()=>updateStatus(appointment._id,'Rejected')} className="flex-1 bg-red-500 text-white py-2.5 px-4 rounded-lg font-medium cursor-default">
              Decline
            </button>
          </div>
        )}
      </div>
      {showModal &&(
      <ConfirmModal message='Are you sure want to Reject Appointment' onConfirm={()=>updateAppointmentStatus(appointment._id,'Rejected',lawyerId!).then((response)=>{
        toast.success(response.data.message)
        setActiveFilter('Rejected')
        setShowModal(false)
      })} onCancel={()=>setShowModal(false)}/>
    )}
    </div>
  );
}

function AppointmentPage() {

  const filters = ['Pending','Accepted','Booked', 'Completed', 'Cancelled', 'Rejected'];

  const [activeFilter,setActiveFilter]=useState('Pending')
  const [appointments,setAppointments]=useState<Appointment[]>([])

  const lawyerId:string | undefined=useSelector((state:RootState)=>state.lawyerAuth.lawyer?._id)

  useEffect(()=>{
    getAppointments(lawyerId!,activeFilter).then((response)=>{
      setAppointments(response.data.data || [])
    })
  },[activeFilter])

  //const filteredAppointments = appointments?.filter(apt => ['Pending', 'Accepted','Booked','Cancelled','Rejected'].includes(apt.status));


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-blue-100 opacity-20 animate-pulse">
          <Calendar size={64} />
        </div>
        <div className="absolute top-32 right-20 text-purple-100 opacity-20 animate-pulse delay-1000">
          <Clock size={48} />
        </div>
        <div className="absolute bottom-20 left-20 text-blue-100 opacity-20 animate-pulse delay-500">
          <MessageCircle size={56} />
        </div>
        <div className="absolute bottom-40 right-10 text-purple-100 opacity-20 animate-pulse delay-700">
          <User size={40} />
        </div>
      </div>

      <div className="relative z-10">
         <Navbar/>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className="text-gray-600 text-lg">Manage and track your upcoming appointments</p>
          </div>
          
          {/* Filter Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-4 mb-8 sticky top-4 z-20">
            <div className="flex flex-wrap gap-2 justify-center">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={()=>setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {/* Appointments List */}
          <div className="space-y-6">
            {appointments?.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-12">
                  <div className="text-gray-400 mb-4">
                    <Calendar size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
                  <p className="text-gray-500">No appointments match the selected filter criteria.</p>
                </div>
              </div>
            ) : (
              appointments?.map(appointment => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  setActiveFilter={setActiveFilter}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentPage;