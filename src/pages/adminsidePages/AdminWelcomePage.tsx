import { useEffect, useState } from "react";
import {
  Rocket,
  BarChart3,
  Users,
  Settings,
  TrendingUp,
  Shield,
  Database,
  Activity,
  Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AdminIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width="500"
        height="400"
        viewBox="0 0 500 400"
        className="w-full h-full max-w-md animate-float"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dashboard Background */}
        <rect
          x="50"
          y="50"
          width="400"
          height="300"
          rx="20"
          fill="url(#dashboardGradient)"
          className="drop-shadow-2xl"
        />

        {/* Dashboard Header */}
        <rect x="50" y="50" width="400" height="60" rx="20" fill="#1F2937" />

        {/* Navigation Dots */}
        <circle cx="80" cy="80" r="6" fill="#EF4444" />
        <circle cx="100" cy="80" r="6" fill="#F59E0B" />
        <circle cx="120" cy="80" r="6" fill="#10B981" />

        {/* Dashboard Title */}
        <rect x="200" y="70" width="120" height="20" rx="4" fill="#6B7280" />

        {/* Chart Cards */}
        <rect
          x="80"
          y="140"
          width="150"
          height="80"
          rx="12"
          fill="#F8FAFC"
          className="animate-pulse"
        />
        <rect
          x="250"
          y="140"
          width="150"
          height="80"
          rx="12"
          fill="#F8FAFC"
          className="animate-pulse"
        />

        {/* Chart Elements */}
        <path
          d="M100 200 L120 180 L140 190 L160 170 L180 175 L200 160"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          className="animate-draw"
        />

        <rect x="270" y="160" width="8" height="30" fill="#3B82F6" />
        <rect x="285" y="170" width="8" height="20" fill="#8B5CF6" />
        <rect x="300" y="155" width="8" height="35" fill="#EF4444" />
        <rect x="315" y="165" width="8" height="25" fill="#F59E0B" />

        {/* Bottom Stats */}
        <rect x="80" y="250" width="320" height="60" rx="12" fill="#F8FAFC" />
        <rect x="100" y="270" width="60" height="8" rx="4" fill="#E5E7EB" />
        <rect x="180" y="270" width="80" height="8" rx="4" fill="#E5E7EB" />
        <rect x="280" y="270" width="50" height="8" rx="4" fill="#E5E7EB" />

        <rect x="100" y="285" width="40" height="6" rx="3" fill="#10B981" />
        <rect x="180" y="285" width="60" height="6" rx="3" fill="#3B82F6" />
        <rect x="280" y="285" width="35" height="6" rx="3" fill="#EF4444" />

        {/* Floating Elements */}
        <circle
          cx="420"
          cy="120"
          r="20"
          fill="#10B981"
          className="animate-bounce"
          opacity="0.8"
        />
        <rect x="410" y="110" width="20" height="20" rx="4" fill="#FFFFFF" />

        <circle
          cx="60"
          cy="180"
          r="15"
          fill="#3B82F6"
          className="animate-pulse"
          opacity="0.6"
        />
        <rect x="53" y="173" width="14" height="14" rx="3" fill="#FFFFFF" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient
            id="dashboardGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 right-12 animate-float-delayed">
          <div className="bg-emerald-500 p-3 rounded-full shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-16 left-8 animate-float-slow">
          <div className="bg-blue-500 p-3 rounded-full shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute top-1/3 right-4 animate-float-reverse">
          <div className="bg-purple-500 p-2 rounded-full shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TypewriterText = ({
  text,
  delay = 100,
}: {
  text: string;
  delay?: number;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span>{displayText}</span>;
};

function AdminWelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const adminDetails = useSelector(
    (state: RootState) => state.adminAuth.isAuthenticate,
  );

  useEffect(() => {
    if (adminDetails) {
      navigate("/admin-dashboard");
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth/admin/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 overflow-hidden">
      {/* Optional floating logo/navbar */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span className="text-gray-700 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <div
              className={`space-y-8 text-center lg:text-left ${
                isLoaded ? "animate-slide-in-left" : "opacity-0"
              }`}
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome Back,
                  </div>
                  <div className="mt-2">
                    <TypewriterText text="Admin!" delay={150} />
                  </div>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Let's dive into your control center and keep everything
                  running smoothly.
                </p>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8">
                <div className="text-center space-y-2">
                  <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2.4K</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-amber-100 p-3 rounded-full w-fit mx-auto">
                    <Scale className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="text-sm text-gray-600">Active Lawyers</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">99.2%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="group relative inline-flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:glow focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Get Started</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg"></div>
                </button>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div
              className={`relative ${
                isLoaded ? "animate-slide-in-right" : "opacity-0"
              }`}
            >
              <AdminIllustration />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
}

export default AdminWelcomePage;
