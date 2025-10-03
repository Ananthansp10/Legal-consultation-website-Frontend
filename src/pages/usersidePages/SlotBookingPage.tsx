import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Scale,
  Clock,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Video,
  Users,
} from "lucide-react";
import UserNavbar from "../../components/userside/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import {
  bookAppointment,
  getLawyerDetails,
  getLawyerSlots,
} from "../../services/user/userService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

function SlotBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const [consultationMode, setConsultationMode] = useState("");
  const [problem, setProblem] = useState("");

  // Validation errors for modal fields
  const [errors, setErrors] = useState({
    consultationMode: "",
    problem: "",
  });

  interface Address {
    street: string;
    country: string;
    state: string;
    city: string;
  }

  interface Education {
    degree: string;
    university: string;
    year: string;
  }

  interface PersonalInfo {
    name: string;
    email: string;
    phoneNumber: string;
    DOB: string;
    gender: string;
    address: Address;
    language: string[];
    profileImage: string;
  }

  interface ProffessionalInfo {
    practiceAreas: string[];
    barRegisterNumber: string;
    experience: string;
    courtName: string;
    workLocation: string;
    fee: string;
    availableDays: string[];
    startTime: string;
    endTime: string;
    education: Education;
    documents: string[];
  }

  interface LawyerProfileData {
    _id?: string;
    lawyerId: string;
    personalInfo: PersonalInfo;
    proffessionalInfo: ProffessionalInfo;
    isReported?: boolean;
    reportCount?: number;
  }

  const [lawyer, setLawyer] = useState<LawyerProfileData>();

  const { lawyerId, caseId } = useParams();

  const userId: string | undefined = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  const navigate = useNavigate();

  useEffect(() => {
    getLawyerDetails(lawyerId!).then((response) => {
      setLawyer(response.data.data);
    });
  }, []);

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "consultationMode":
        if (!value.trim()) {
          error = "Please select a consultation mode";
        }
        break;

      case "problem":
        if (!value.trim()) {
          error = "Please describe your legal problem";
        } else if (value.trim().length < 50) {
          error = "Problem description must be at least 50 characters long";
        } else if (value.trim().length > 500) {
          error = "Problem description must not exceed 500 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleConsultationModeChange = (mode: string) => {
    setConsultationMode(mode);

    // Clear error when user makes selection
    if (errors.consultationMode) {
      setErrors((prev) => ({ ...prev, consultationMode: "" }));
    }
  };

  const handleProblemChange = (value: string) => {
    setProblem(value);

    // Clear error when user starts typing
    if (errors.problem) {
      setErrors((prev) => ({ ...prev, problem: "" }));
    }
  };

  const handleProblemBlur = () => {
    validateField("problem", problem);
  };

  const validateModal = () => {
    const consultationModeValid = validateField(
      "consultationMode",
      consultationMode
    );
    const problemValid = validateField("problem", problem);

    return consultationModeValid && problemValid;
  };

  function handleConfirmBookingClick() {
    setShowModal(true);
  }

  function confirmBooking() {
    if (!validateModal()) {
      return;
    }

    bookAppointment(
      {
        lawyerId: lawyerId!,
        userId: userId!,
        date: selectedDate?.toLocaleDateString("en-CA")!,
        time: selectedTime,
        consultationMode: consultationMode,
        problem: problem,
        fee: parseInt(lawyer?.proffessionalInfo.fee!),
      },
      caseId
    )
      .then((response) => {
        toast.success(response.data.message);
        setShowModal(false);
        // Clear form data
        setConsultationMode("");
        setProblem("");
        setErrors({ consultationMode: "", problem: "" });
        navigate("/user/appointments");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  const handleModalClose = () => {
    setShowModal(false);
    // Clear form data and errors
    setConsultationMode("");
    setProblem("");
    setErrors({ consultationMode: "", problem: "" });
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  const isDateToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  interface TimeSlotsData {
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }

  const [timeSlots, setTimeSlots] = useState<TimeSlotsData[]>([]);

  function getTimeSlots() {
    const isoDate = selectedDate?.toLocaleDateString("en-CA");
    getLawyerSlots(lawyerId!, isoDate!).then((response) => {
      if (response?.data?.timeSlots) {
        setTimeSlots(response.data.timeSlots);
      } else {
        setTimeSlots([]);
      }
    });
  }

  const formatDate = (date: Date) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${dayNames[date.getDay()]}, ${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      days.push({
        date: day,
        fullDate: date,
        formattedDate: formatDate(date),
        isPast: isDatePast(date),
        isToday: isDateToday(date),
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    // Set initial date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If tomorrow is in the next month, navigate to that month
    if (
      tomorrow.getMonth() !== currentMonth.getMonth() ||
      tomorrow.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
    }

    setSelectedDate(tomorrow);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getTimeSlots();
    }
  }, [selectedDate]);

  const isModalValid =
    consultationMode &&
    problem.trim().length >= 10 &&
    problem.trim().length <= 500 &&
    !Object.values(errors).some((error) => error !== "");

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Legal Pattern Background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-10 left-10 transform rotate-12">
          <Scale size={120} className="text-[#3b82f6]" />
        </div>
        <div className="absolute top-32 right-20 transform -rotate-12">
          <Scale size={80} className="text-[#6366f1]" />
        </div>
        <div className="absolute bottom-20 left-1/4 transform rotate-45">
          <Scale size={100} className="text-[#3b82f6]" />
        </div>
        <div className="absolute bottom-40 right-1/3 transform -rotate-30">
          <Scale size={90} className="text-[#6366f1]" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <UserNavbar navLink="Lawyers" />
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <button className="flex items-center gap-2 text-[#64748b] hover:text-[#3b82f6] transition-colors duration-200">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Lawyers</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e2e8f0] relative overflow-hidden">
            {/* Floating Legal Icon Background */}
            <div className="absolute top-4 right-4 opacity-5">
              <Scale size={120} className="text-[#3b82f6]" />
            </div>

            <div className="flex items-start gap-6 relative z-10">
              <div className="relative">
                <img
                  src={lawyer?.personalInfo?.profileImage}
                  alt="Lawyer"
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-full flex items-center justify-center">
                  <Scale size={16} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-serif font-bold text-[#334155] mb-2">
                  {lawyer?.personalInfo?.name}
                </h1>
                <p className="text-[#64748b] text-lg mb-4">
                  {lawyer?.proffessionalInfo?.practiceAreas[0]} •{" "}
                  {lawyer?.proffessionalInfo?.experience} experience
                </p>
                <div className="flex items-center gap-6 text-sm text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>
                      {lawyer?.proffessionalInfo?.workLocation}{" "}
                      {lawyer?.proffessionalInfo?.courtName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>30 min consultation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Date Picker */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-[#334155] mb-6">
            Select Date
          </h2>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#e2e8f0]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors duration-200 text-[#64748b] hover:text-[#3b82f6]"
              >
                <ChevronLeft size={20} />
              </button>

              <h3 className="text-xl font-serif font-bold text-[#334155]">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h3>

              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors duration-200 text-[#64748b] hover:text-[#3b82f6]"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-[#64748b] py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((dayItem, index) => {
                if (!dayItem) {
                  return <div key={index} className="h-12"></div>;
                }

                return (
                  <div
                    key={index}
                    onClick={() =>
                      !dayItem.isPast && setSelectedDate(dayItem.fullDate)
                    }
                    className={`
                      h-12 rounded-lg flex items-center justify-center text-center cursor-pointer transition-all duration-300 relative
                      ${
                        dayItem.isPast
                          ? "text-[#cbd5e1] cursor-not-allowed"
                          : "hover:scale-110 hover:shadow-md"
                      }
                      ${
                        selectedDate?.toDateString() ===
                        dayItem.fullDate.toDateString()
                          ? "bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white shadow-lg ring-2 ring-[#3b82f6] ring-opacity-30"
                          : dayItem.isPast
                          ? "bg-[#f8fafc]"
                          : "bg-[#f8fafc] hover:bg-[#3b82f6] hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`font-semibold ${
                        selectedDate?.toDateString() ===
                        dayItem.fullDate.toDateString()
                          ? "text-white"
                          : dayItem.isPast
                          ? "text-[#cbd5e1]"
                          : "text-[#334155]"
                      }`}
                    >
                      {dayItem?.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Slot Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-[#334155] mb-6">
            Available Time Slots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlots.length === 0 ? (
              <div className="text-center text-red-500 font-medium col-span-full">
                No slots available for the selected date.
              </div>
            ) : (
              timeSlots?.map((slot, index) => (
                <div
                  key={index}
                  onClick={() =>
                    !slot.isBooked &&
                    setSelectedTime(`${slot.startTime}-${slot.endTime}`)
                  }
                  className={`
                  rounded-xl p-4 text-center transition-all duration-300 cursor-pointer border-2
                  ${
                    !slot.isBooked
                      ? `bg-white border-[#e2e8f0] hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/10
                       ${
                         selectedTime === `${slot.startTime}-${slot.endTime}`
                           ? "border-[#3b82f6] bg-gradient-to-br from-[#3b82f6]/5 to-white shadow-lg"
                           : ""
                       }
                      `
                      : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                  }
                `}
                >
                  <div
                    className={`font-bold text-lg mb-2 ${
                      !slot.isBooked
                        ? selectedTime === `${slot.startTime}-${slot.endTime}`
                          ? "text-[#3b82f6]"
                          : "text-[#334155]"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      !slot.isBooked ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {!slot.isBooked ? "Available" : "Booked"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slot Summary Panel */}
        <div className="sticky bottom-0 z-20 bg-white rounded-2xl p-6 shadow-xl border border-[#e2e8f0] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-serif font-bold text-[#334155] mb-2">
                Booking Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#3b82f6]" />
                  <span className="text-[#64748b]">Date:</span>
                  <span className="font-semibold text-[#334155]">
                    {selectedDate?.toDateString() || "Select date"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#3b82f6]" />
                  <span className="text-[#64748b]">Time:</span>
                  <span className="font-semibold text-[#334155]">
                    {selectedTime
                      ? `${selectedTime.split("-")[0]} – ${
                          selectedTime.split("-")[1]
                        }`
                      : "Select time"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">Fee:</span>
                  <span className="font-bold text-[#3b82f6] text-lg">
                    ₹{lawyer?.proffessionalInfo?.fee}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmBookingClick}
              disabled={!selectedDate || !selectedTime}
              className={`font-semibold py-4 px-8 rounded-xl transition-all duration-300 min-w-[200px] group relative overflow-hidden ${
                selectedDate && selectedTime
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white hover:shadow-lg hover:shadow-[#3b82f6]/25 hover:-translate-y-0.5 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="relative z-10">Confirm Booking</span>
              {selectedDate && selectedTime && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#334155]">
                Booking Details
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors duration-200"
              >
                <X size={20} className="text-[#64748b]" />
              </button>
            </div>

            {/* Consultation Mode */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#334155] mb-3">
                Consultation Mode *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleConsultationModeChange("online")}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                    consultationMode === "online"
                      ? "border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]"
                      : `border-[#e2e8f0] hover:border-[#3b82f6] text-[#64748b] ${
                          errors.consultationMode ? "border-red-500" : ""
                        }`
                  }`}
                >
                  <Video size={20} />
                  <span className="font-medium">Online</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConsultationModeChange("in-person")}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
                    consultationMode === "in-person"
                      ? "border-[#3b82f6] bg-[#3b82f6]/5 text-[#3b82f6]"
                      : `border-[#e2e8f0] hover:border-[#3b82f6] text-[#64748b] ${
                          errors.consultationMode ? "border-red-500" : ""
                        }`
                  }`}
                >
                  <Users size={20} />
                  <span className="font-medium">In Person</span>
                </button>
              </div>
              {errors.consultationMode && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.consultationMode}
                </p>
              )}
            </div>

            {/* Problem Description */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#334155] mb-3">
                Describe your problem *{" "}
                <span className="text-xs text-[#64748b]">
                  ({problem.length}/500)
                </span>
              </label>
              <textarea
                value={problem}
                onChange={(e) => handleProblemChange(e.target.value)}
                onBlur={handleProblemBlur}
                rows={4}
                placeholder="Please provide details about your legal issue..."
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  errors.problem
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#e2e8f0] focus:ring-[#3b82f6]"
                }`}
                maxLength={500}
              />
              {errors.problem && (
                <p className="text-red-500 text-sm mt-2">{errors.problem}</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleModalClose}
                className="flex-1 py-3 px-4 border border-[#e2e8f0] text-[#64748b] rounded-lg font-semibold hover:bg-[#f8fafc] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={!isModalValid}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isModalValid
                    ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white hover:shadow-lg hover:shadow-[#3b82f6]/25 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlotBookingPage;
