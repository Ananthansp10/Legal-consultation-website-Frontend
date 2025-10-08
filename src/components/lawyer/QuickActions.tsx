import React from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 2,
      title: "View Calendar",
      description: "Check your schedule",
      icon: Calendar,
      color: "text-blue-700",
      bgColor: "bg-gradient-to-br from-blue-100 to-indigo-200",
      hoverBg: "group-hover:from-blue-200 group-hover:to-indigo-300",
      shadowColor: "group-hover:shadow-blue-300/50",
    },
    {
      id: 3,
      title: "Add Availability",
      description: "Manage your time slots",
      icon: Clock,
      color: "text-emerald-700",
      bgColor: "bg-gradient-to-br from-emerald-100 to-green-200",
      hoverBg: "group-hover:from-emerald-200 group-hover:to-green-300",
      shadowColor: "group-hover:shadow-emerald-300/50",
    },
    {
      id: 4,
      title: "Send Quick Message",
      description: "Communicate with clients",
      icon: MessageSquare,
      color: "text-rose-700",
      bgColor: "bg-gradient-to-br from-rose-100 to-pink-200",
      hoverBg: "group-hover:from-rose-200 group-hover:to-pink-300",
      shadowColor: "group-hover:shadow-rose-300/50",
    },
  ];

  const navigate = useNavigate();

  function navigateLinks(link: string) {
    if (link == "View Calendar") {
      navigate("/lawyer/slot-list-page");
    }
    if (link == "Add Availability") {
      navigate("/lawyer/add-availablity");
    }
    if (link == "Send Quick Message") {
      navigate("/lawyer/chat-list");
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Quick Actions
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigateLinks(action.title)}
              className={`group relative ${action.bgColor} ${action.hoverBg} rounded-2xl p-8 border border-white/50 hover:shadow-2xl ${action.shadowColor} hover:-translate-y-2 transition-all duration-500 text-left overflow-hidden`}
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <IconComponent
                    className={`h-8 w-8 ${action.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors duration-300">
                  {action.title}
                </h3>

                <p className="text-slate-700 group-hover:text-slate-800 transition-colors duration-300 leading-relaxed">
                  {action.description}
                </p>

                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/80 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
