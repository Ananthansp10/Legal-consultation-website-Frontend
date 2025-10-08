import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Briefcase,
  User,
  X,
  CreditCard,
  FileText,
  MessageCircle,
} from "lucide-react";
import UserNavbar from "../../components/userside/Navbar";
import {
  cancelAppointment,
  getAppointments,
  resheduleAppointment,
} from "../../services/user/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { createRazorpayOrder } from "../../services/user/paymentService";
import { handlePayment } from "../../config/razorpay";
import { User as userDetails } from "../../interface/userInterface/userInterface";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/reusableComponents/ConfirmModal";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/reusableComponents/Pagination";

function UserAppointmentPage() {
  const [activeTab, setActiveTab] = useState("Pending");

  interface LawyerData {
    _id: string;
    name: string;
    specialization: string[];
    profileImage: string;
    fee: string;
  }

  interface AppointmentsData {
    _id: string;
    lawyer: LawyerData;
    date: string;
    time: string;
    mode: string;
    status: string;
    payment: string;
    problem: string;
    paymentDate?: string;
    paymentMode?: string;
    meetStart?: boolean;
    note?: string;
    caseId: number;
  }

  interface AppointmentCardData {
    appointment: AppointmentsData;
    isCompleted?: boolean;
  }

  interface PaymentHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: AppointmentsData;
  }

  const user: userDetails | null = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [appointments, setAppointments] = useState<Array<AppointmentsData>>([]);
  const [showModal, setShowModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [reshedule, setReshedule] = useState(false);
  const [lawyerId, setLawyerId] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentsData | null>(null);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [totalPages, setTotalPages] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    getAppointments(user?.id ?? "", activeTab, startIndex, itemsPerPage).then(
      (response) => {
        setAppointments(response.data.data);
        setTotalPages(
          Math.ceil(response.data.totalAppointments / itemsPerPage),
        );
      },
    );
  }, [activeTab, currentPage]);

  function generateRazorpay(id: string, fee: number, lawyerId: string) {
    createRazorpayOrder({ id: id, fee: fee, lawyerId: lawyerId }).then(
      (response) => {
        handlePayment(response.data.data, user!, id)
          .then((response) => {
            toast.success(response.data.message);
            setActiveTab("Upcoming");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            setActiveTab("Accepted");
          });
      },
    );
  }

  function cancelModal(id: string) {
    setAppointmentId(id);
    setShowModal(true);
  }

  function appointmentCancel(id: string) {
    cancelAppointment(id)
      .then((response) => {
        toast.success(response.data.message);
        setActiveTab("Cancelled");
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  function resheduleModal(id: string, lawyerId: string) {
    setAppointmentId(id);
    setLawyerId(lawyerId);
    setReshedule(true);
    setShowModal(true);
  }

  function appointmentReshedule() {
    resheduleAppointment(appointmentId).then(() => {
      navigate(`/user/slot-booking/${lawyerId}`);
    });
  }

  function handleCardClick(appointment: AppointmentsData) {
    if (
      appointment.status === "Booked" ||
      appointment.status == "Completed" ||
      appointment.status == "Cancelled"
    ) {
      setSelectedAppointment(appointment);
      setShowPaymentModal(true);
    }
  }

  function handleContinueConsultation(lawyerId: string, caseId: number) {
    navigate(`/user/continue-slot-booking/${lawyerId}/${caseId}`);
  }

  const PaymentHistoryModal = ({
    isOpen,
    onClose,
    appointment,
  }: PaymentHistoryModalProps) => {
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
              <h3 className="text-lg font-semibold text-slate-800">
                Payment History
              </h3>
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
                <span className="text-sm font-medium text-gray-600">
                  Appointment ID
                </span>
                <span className="text-sm text-gray-900 font-mono">
                  {appointment._id.slice(-8)}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Payment Status
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    appointment.payment === "Success"
                      ? "bg-green-100 text-green-700"
                      : appointment.payment === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status == "Cancelled"
                    ? appointment.status
                    : appointment.payment || "Refunded"}
                </span>
              </div>

              {/* Payment Mode */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Payment Mode
                </span>
                <span className="text-sm text-gray-900">
                  {appointment.paymentMode || "Online Payment"}
                </span>
              </div>

              {/* Payment Date */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Payment Date
                </span>
                <span className="text-sm text-gray-900">
                  {appointment.paymentDate}
                </span>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Amount Paid
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  ₹{appointment.lawyer.fee}
                </span>
              </div>

              {/* Lawyer Details */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Consultation Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lawyer</span>
                    <span className="text-gray-900">
                      {appointment.lawyer.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="text-gray-900">
                      {appointment.date} at {appointment.time}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mode</span>
                    <span className="text-gray-900 capitalize">
                      {appointment.mode}
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

  const AppointmentCard = ({
    appointment,
    isCompleted = false,
  }: AppointmentCardData) => (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg hover:ring-1 hover:ring-blue-100 transition-all duration-300 p-6 mb-4 ${
        appointment.status === "Booked"
          ? "cursor-pointer"
          : appointment.status === "Completed"
            ? "cursor-pointer"
            : appointment.status === "Cancelled"
              ? "cursor-pointer"
              : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={appointment.lawyer.profileImage}
              alt={appointment.lawyer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-800">
                {appointment.lawyer.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appointment.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : appointment.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <p className="text-slate-600 text-sm mb-3">
              {appointment.lawyer.specialization[0]}
            </p>

            <p className="text-slate-600 text-sm mb-3">{appointment.problem}</p>

            {/* Note section for completed appointments */}
            {appointment.status === "Completed" && appointment.note && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3 rounded-r-lg">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800 mb-1">
                      Lawyer's Note:
                    </p>
                    <p className="text-sm text-blue-700">{appointment.note}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm">
                {appointment.mode == "online" ? (
                  <Video className="w-4 h-4 text-blue-500" />
                ) : (
                  <MapPin className="w-4 h-4 text-green-500" />
                )}
                <span
                  className={
                    appointment.mode == "online"
                      ? "text-blue-600"
                      : "text-green-600"
                  }
                >
                  {appointment.mode}
                </span>
              </div>

              {/* Conditional button based on appointment status */}
              {appointment.status === "Pending" ? (
                <div
                  className="flex items-center space-x-2 ps-12"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      resheduleModal(appointment._id, appointment.lawyer._id)
                    }
                    className="bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => cancelModal(appointment._id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : appointment.status === "Accepted" ? (
                // Pay Now or Repay button for accepted appointments + Cancel and Reschedule buttons
                <div
                  className="flex items-center justify-between w-full ml-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      generateRazorpay(
                        appointment._id,
                        Number(appointment.lawyer.fee),
                        appointment.lawyer._id,
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      appointment.payment === "Failed"
                        ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                        : "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    {appointment.payment === "Failed"
                      ? `Repay ${appointment.lawyer.fee}`
                      : `Pay ${appointment.lawyer.fee}`}
                  </button>
                  <div className="flex items-center space-x-2 ps-12">
                    {/* <button
                      onClick={()=>resheduleModal(appointment._id)}
                      className="bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                      Reschedule
                    </button> */}
                    <button
                      onClick={() => cancelModal(appointment._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : appointment.status === "Booked" &&
                appointment.mode == "online" &&
                appointment.meetStart ? (
                // Join Link button + Cancel button for booked online appointments when meetStart is true
                <div
                  className="flex items-center justify-between w-full ml-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      navigate(`/user/video-call/${appointment._id}`)
                    }
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Join Link
                  </button>
                  <div className="flex items-center space-x-2 ps-12">
                    <button
                      onClick={() => cancelModal(appointment._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : appointment.status === "Booked" ? (
                // Cancel button only for booked appointments (offline or online without meetStart)
                <div
                  className="flex items-center space-x-2 ps-12"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => cancelModal(appointment._id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : appointment.status === "Completed" ? (
                // Continue Consultation button for completed appointments
                <div
                  className="flex items-center space-x-2 ps-12"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      handleContinueConsultation(
                        appointment.lawyer._id,
                        appointment.caseId,
                      )
                    }
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Continue Consultation</span>
                  </button>
                </div>
              ) : (
                <div></div>
                // Disabled button for cancelled/rejected appointments
                // <button
                //   className="bg-gray-100 text-gray-400 cursor-not-allowed line-through px-4 py-2 rounded-lg text-sm font-medium transition-all"
                //   disabled
                // >
                //   {/* Join Link */}
                // </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click hint for booked appointments */}
      {appointment.status === "Booked" && (
        <div
          onClick={() => handleCardClick(appointment)}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <p className="text-xs text-blue-600 text-center">
            💡 Click to view payment history
          </p>
        </div>
      )}
      {appointment.status === "Cancelled" && appointment.paymentDate && (
        <div
          onClick={() => handleCardClick(appointment)}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <p className="text-xs text-blue-600 text-center">
            💡 Click to view payment history
          </p>
        </div>
      )}
      {appointment.status === "Completed" && (
        <div
          onClick={() => handleCardClick(appointment)}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <p className="text-xs text-blue-600 text-center">
            💡 Click to view payment history
          </p>
        </div>
      )}
    </div>
  );

  const getTabColor = (tabName: string) => {
    switch (tabName) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-blue-100 text-blue-700";
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getTabTitle = (tabName: string) => {
    switch (tabName) {
      case "Pending":
        return "Pending Appointments";
      case "Accepted":
        return "Accepted Appointments";
      case "Upcoming":
        return "Upcoming Appointments";
      case "Completed":
        return "Completed Appointments";
      case "Cancelled":
        return "Cancelled Appointments";
      case "Rejected":
        return "Rejected Appointments";
      default:
        return "Appointments";
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 opacity-5 transform rotate-12">
          <Briefcase className="w-48 h-48 text-blue-500" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-5 transform -rotate-12">
          <Calendar className="w-32 h-32 text-blue-500" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <UserNavbar navLink="My Appointments" />
        <div className="text-center mb-12 mt-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            My Appointments
          </h1>
          <p className="text-lg text-slate-600">
            Track your consultations with legal experts
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1 shadow-sm border border-gray-200">
            <div className="flex flex-wrap justify-center gap-1">
              <button
                onClick={() => setActiveTab("Pending")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Pending"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md ring-2 ring-yellow-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("Accepted")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Accepted"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md ring-2 ring-blue-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setActiveTab("Upcoming")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Upcoming"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md ring-2 ring-blue-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("Completed")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Completed"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md ring-2 ring-green-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab("Cancelled")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Cancelled"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md ring-2 ring-red-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Cancelled
              </button>
              <button
                onClick={() => setActiveTab("Rejected")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "Rejected"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md ring-2 ring-red-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Active Tab */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              {getTabTitle(activeTab)}
            </h2>
            <div
              className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getTabColor(
                activeTab,
              )}`}
            >
              {appointments?.length || 0}
            </div>
          </div>

          <div className="space-y-4">
            {appointments?.map((appointment) => (
              <AppointmentCard
                key={appointment?._id}
                appointment={appointment}
                isCompleted={activeTab === "Completed"}
              />
            ))}
          </div>
        </div>

        {/* Empty State Message */}
        {appointments?.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-slate-500">
              Your {activeTab} consultations will appear here.
            </p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 0}
        onPageChange={setCurrentPage}
      />
      {showModal && (
        <ConfirmModal
          message="Are you sure want to Cancel this Appointment"
          onConfirm={() => appointmentCancel(appointmentId)}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showModal && reshedule && (
        <ConfirmModal
          message="Are you sure want to Reshedule this Appointment"
          onConfirm={() => appointmentReshedule()}
          onCancel={() => setShowModal(false)}
        />
      )}

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

export default UserAppointmentPage;
