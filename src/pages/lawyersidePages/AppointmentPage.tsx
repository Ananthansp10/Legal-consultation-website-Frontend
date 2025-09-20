import { Calendar, Clock, MessageCircle, User, MapPin, Video, CheckCircle, XCircle, CreditCard, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAppointments, updateAppointmentStatus } from '../../services/lawyer/lawyerService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/reusableComponents/ConfirmModal';
import LawyerNavbar from '../../components/lawyer/Navbar';
import Pagination from '../../components/reusableComponents/Pagination';
import { useNavigate } from 'react-router-dom';

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
  status: 'Accepted' | 'Pending' | 'Rejected' | 'Completed' | 'Cancelled' | 'Booked';
  payment?: string;
  paymentDate?: string;
  paymentMode?: string;
  fee?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  setActiveFilter: (filter: string) => void;
  onCardClick: (appointment: Appointment) => void;
}

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
}

// Helper: Get today's date as 'YYYY-MM-DD'
function getTodayDateStr() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const PaymentHistoryModal = ({ isOpen, onClose, appointment }: PaymentHistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Payment History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Appointment ID */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Appointment ID</span>
              <span className="text-sm text-gray-900 font-mono">{appointment._id.slice(-8)}</span>
            </div>

            {/* Payment Status */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Payment Status</span>
              <span className={`text-sm px-2 py-1 rounded-full ${appointment.payment === 'Success'
                  ? 'bg-green-100 text-green-700'
                  : appointment.payment === 'Failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                {appointment.payment || 'Refunded'}
              </span>
            </div>

            {/* Payment Mode */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Payment Mode</span>
              <span className="text-sm text-gray-900">
                {appointment.paymentMode || 'Online Payment'}
              </span>
            </div>

            {/* Payment Date */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Payment Date</span>
              <span className="text-sm text-gray-900">
                {appointment.paymentDate}
              </span>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Amount Received</span>
              <span className="text-sm text-gray-900 font-semibold">
                ₹{appointment.fee}
              </span>
            </div>

            {/* Client Details */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Consultation Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Client</span>
                  <span className="text-gray-900">{appointment.user.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="text-gray-900">{appointment.date} at {appointment.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mode</span>
                  <span className="text-gray-900 capitalize">{appointment.mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Problem</span>
                  <span className="text-gray-900 text-right max-w-[150px] truncate" title={appointment.problem}>
                    {appointment.problem}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function AppointmentCard({ appointment, setActiveFilter, onCardClick }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
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

  const [showModal, setShowModal] = useState(false);

  const lawyerId: string | undefined = useSelector((state: RootState) => state.lawyerAuth.lawyer?._id);

  function updateStatus(id: string, status: string) {
    if (status === 'Accepted') {
      updateAppointmentStatus(id, status, lawyerId!).then((response) => {
        toast.success(response.data.message);
        setActiveFilter('Accepted');
      }).catch((error) => {
        toast.error(error.response.data.message);
      });
    } else {
      setShowModal(true);
    }
  }

  const showStartMeeting =
    appointment.status === 'Booked' &&
    appointment.date === getTodayDateStr();

  const navigate = useNavigate();

  const canShowPaymentHistory = ['Booked', 'Completed', 'Cancelled'].includes(appointment.status);

  const handleCardClick = () => {
    if (canShowPaymentHistory) {
      onCardClick(appointment);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-6 overflow-hidden ${canShowPaymentHistory ? 'cursor-pointer' : ''
        }`}
      onClick={handleCardClick}
    >
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
          <div className="flex space-x-3 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => updateStatus(appointment._id, 'Accepted')} className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium cursor-default">
              Accept Appointment
            </button>
            <button onClick={() => updateStatus(appointment._id, 'Rejected')} className="flex-1 bg-red-500 text-white py-2.5 px-4 rounded-lg font-medium cursor-default">
              Decline
            </button>
          </div>
        )}

        {/* ---- "Start Meeting" Button Only For Booked & Today's Date ---- */}
        {showStartMeeting && (
          <div className="pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium"
              onClick={() => navigate(`/lawyer/video-call/${appointment._id}`)}
            >
              Start Meeting
            </button>
          </div>
        )}
        {/* ------------------------------------------------------------- */}

        {/* Click hint for appointments with payment history */}
        {canShowPaymentHistory && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-blue-600 text-center">
              💡 Click to view payment history
            </p>
          </div>
        )}

      </div>
      {showModal && (
        <ConfirmModal
          message='Are you sure want to Reject Appointment'
          onConfirm={() => updateAppointmentStatus(appointment._id, 'Rejected', lawyerId!).then((response) => {
            toast.success(response.data.message);
            setActiveFilter('Rejected');
            setShowModal(false);
          })}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function AppointmentPage() {

  const filters = ['Pending', 'Accepted', 'Booked', 'Completed', 'Cancelled', 'Rejected'];

  const [activeFilter, setActiveFilter] = useState('Pending');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const lawyerId: string | undefined = useSelector((state: RootState) => state.lawyerAuth.lawyer?._id);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 2;
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    getAppointments(lawyerId!, activeFilter, startIndex, itemsPerPage).then((response) => {
      setAppointments(response.data.data || []);
      setTotalPages(Math.ceil(response.data.totalAppointments / itemsPerPage))
    });
  }, [activeFilter, currentPage]);

  const handleCardClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

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
        <LawyerNavbar />
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
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${activeFilter === filter
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
                  onCardClick={handleCardClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages || 0} onPageChange={setCurrentPage} />

      {/* Payment History Modal */}
      {selectedAppointment && (
        <PaymentHistoryModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
}

export default AppointmentPage;