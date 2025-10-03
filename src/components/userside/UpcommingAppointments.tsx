import React, { useEffect, useState } from "react";
import { Calendar, Clock, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodaysAppointments } from "../../services/user/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Appointment {
  _id: string;
  name: string;
  profileImage: string;
  date: string;
  time: string;
  mode: string;
  specialization: string;
}

const UpcomingAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  const userId: string | undefined = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  useEffect(() => {
    getTodaysAppointments(userId!).then((response) => {
      setAppointments(response.data.data);
    });
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-700">
          Today's Appointments
        </h2>
        <button
          onClick={() => navigate("/user/appointments")}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments?.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={appointment.profileImage}
                    alt={appointment.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      {appointment.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {appointment.specialization}
                    </p>
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
                  {appointment.mode === "online" && (
                    <button
                      onClick={() =>
                        navigate(`/user/video-call/${appointment._id}`)
                      }
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Meeting</span>
                    </button>
                  )}
                  {/* <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reschedule</span>
                </button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-red-500 text-lg font-medium text-center">
            No Appointments Today
          </h4>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
