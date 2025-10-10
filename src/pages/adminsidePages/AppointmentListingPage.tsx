import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getAppointments,
  searchAppointment,
} from "../../services/admin/adminService";
import Pagination from "../../components/reusableComponents/Pagination";

interface Appointment {
  userName: string;
  lawyerName: string;
  date: string;
  time: string;
  specialization: string;
  problem: string;
  appointmentStatus:
    | "Pending"
    | "Accepted"
    | "Booked"
    | "Completed"
    | "Cancelled"
    | "Rejected";
  userProfileImage: string;
  lawyerProfileImage: string;
  feedback?: string;
  note?: string;
  rating?: number;
}

const getStatusConfig = (status: Appointment["appointmentStatus"]) => {
  const configs = {
    Pending: {
      text: "Pending",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-100",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    Accepted: {
      text: "Accepted",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-100",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    Booked: {
      text: "Booked",
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
      icon: <Calendar className="w-4 h-4" />,
    },
    Completed: {
      text: "Completed",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-100",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    Cancelled: {
      text: "Cancelled",
      textColor: "text-red-700",
      bgColor: "bg-red-100",
      icon: <XCircle className="w-4 h-4" />,
    },
    Rejected: {
      text: "Rejected",
      textColor: "text-orange-700",
      bgColor: "bg-orange-100",
      icon: <XCircle className="w-4 h-4" />,
    },
  };
  return configs[status];
};

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({
  appointment,
}) => {
  const statusConfig = getStatusConfig(appointment.appointmentStatus);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
      {/* Status Badge */}
      <div className="flex justify-end mb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.textColor} ${statusConfig.bgColor}`}
        >
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

      {/* Only show button for "Completed" status */}
      {appointment.appointmentStatus === "Completed" && (
        <button
          className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("open-appointment-modal", {
                detail: appointment,
              }),
            );
          }}
        >
          View Note & Feedback
        </button>
      )}
    </div>
  );
};

function AppointmentNoteModal({
  open,
  onClose,
  appointment,
}: {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}) {
  const feedback = appointment?.feedback ?? "No feedback available";
  const finalNote = appointment?.note ?? "No summary note available";
  const rating = appointment?.rating ?? 0;

  if (!open || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          Appointment Summary & Feedback
        </h2>
        <div className="mb-4">
          <div className="text-sm text-gray-600 font-semibold mb-1">
            Final Note:
          </div>
          <div className="text-gray-800">{finalNote}</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600 font-semibold mb-1">
            Feedback:
          </div>
          <div className="text-gray-800">{feedback}</div>
        </div>
        <div className="mb-2">
          <div className="text-sm text-gray-600 font-semibold mb-1">
            Rating:
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.381-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.786.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.287-3.966z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentListingPage() {
  const [activeFilter, setActiveFilter] = useState<
    "All" | Appointment["appointmentStatus"]
  >("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [totalPages, setTotalPages] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    getAppointments(activeFilter, startIndex, itemsPerPage).then((response) => {
      setAppointments(response.data.data.appointments);
      setTotalPages(
        Math.ceil(response.data.data.totalAppointments / itemsPerPage),
      );
    });
  }, [activeFilter, currentPage]);

  const filterTabs = [
    { key: "All" as const, label: "All" },
    { key: "Pending" as const, label: "Pending" },
    { key: "Accepted" as const, label: "Accepted" },
    { key: "Booked" as const, label: "Booked" },
    { key: "Cancelled" as const, label: "Cancelled" },
    { key: "Rejected" as const, label: "Rejected" },
  ];

  // Search bar state, not used for filtering yet
  const [searchTerm, setSearchTerm] = useState("");

  function appointmentSearch() {
    searchAppointment(searchTerm).then((response) => {
      setAppointments(response.data.data);
    });
  }

  // Listen for modal open event
  useEffect(() => {
    function handleOpenModal(event: any) {
      setSelectedAppointment(event.detail);
      setModalOpen(true);
    }
    window.addEventListener("open-appointment-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-appointment-modal", handleOpenModal);
    };
  }, []);

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

          {/* Search Bar */}
          <div className="mb-6 flex items-center justify-center space-x-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter user name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button
              onClick={appointmentSearch}
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Search
            </button>
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
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {appointments?.map((appointment) => (
              <AppointmentCard
                key={`${appointment.userName}-${appointment.date}-${appointment.time}`}
                appointment={appointment}
              />
            ))}
          </div>

          {/* Empty State (if no appointments) */}
          {appointments?.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeFilter === "All"
                  ? "No appointments found"
                  : `No ${activeFilter} appointments`}
              </h3>
              <p className="text-gray-600">
                {activeFilter === "All"
                  ? "You don't have any appointments scheduled at the moment."
                  : `There are no ${activeFilter} appointments to display.`}
              </p>
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 0}
          onPageChange={setCurrentPage}
        />
        {/* Modal */}
        <AppointmentNoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          appointment={selectedAppointment}
        />
      </div>
    </div>
  );
}

export default AppointmentListingPage;
