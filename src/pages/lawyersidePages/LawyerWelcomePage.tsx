import { useEffect, useState } from "react";
import {
  Scale,
  Calendar,
  MessageCircle,
  FileText,
  Bell,
  Shield,
  Users,
  Gavel,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function LawyerWelcomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navigate = useNavigate();
  const lawyerDetails = useSelector(
    (state: RootState) => state.lawyerAuth.isAuthenticate
  );

  useEffect(() => {
    if (lawyerDetails) {
      navigate("/lawyer-dashboard");
    }
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Seamlessly manage client meetings and court dates",
    },
    {
      icon: MessageCircle,
      title: "Client Communication",
      description: "Secure messaging and document sharing platform",
    },
    {
      icon: FileText,
      title: "Case Management",
      description: "Organize and track all your legal cases efficiently",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated on deadlines and important events",
    },
  ];

  function gotoSignup() {
    navigate("/auth/lawyer/signup");
  }

  function gotoSignin() {
    navigate("/auth/lawyer/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-100/30 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Legal Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Scale className="absolute top-1/4 left-1/4 w-6 h-6 text-blue-200/40 animate-pulse" />
        <Gavel className="absolute top-3/4 right-1/4 w-5 h-5 text-indigo-200/40 animate-pulse delay-1000" />
        <Shield className="absolute top-1/2 left-1/6 w-4 h-4 text-blue-200/30 animate-pulse delay-500" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Legal Connect
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-8 py-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Hero Section */}
            <div
              className={`text-center mb-20 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/10 max-w-4xl mx-auto relative">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/5 rounded-3xl"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Scale className="w-10 h-10 text-white" />
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Legal Connect
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                    The professional platform designed exclusively for legal
                    practitioners to streamline practice management and enhance
                    client relationships
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={gotoSignup}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={gotoSignin}
                      className="group backdrop-blur-lg bg-white/30 hover:bg-white/40 border border-white/40 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Sign In</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Everything you need to manage your practice
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Comprehensive tools designed specifically for legal
                  professionals to enhance productivity and client satisfaction
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 hover:scale-105 hover:bg-white/30 cursor-pointer ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div
              className={`mt-20 text-center transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="backdrop-blur-lg bg-white/15 border border-white/25 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-xl shadow-blue-500/10">
                <div className="flex items-center justify-center mb-8">
                  <Users className="w-12 h-12 text-blue-600 mr-4" />
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Trusted by Legal Professionals
                  </h2>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8">
                  Legal Connect empowers law firms and solo practitioners with
                  cutting-edge technology to deliver exceptional client service
                  while streamlining administrative tasks. Join thousands of
                  legal professionals who trust our platform to grow their
                  practice.
                </p>

                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center">
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      10,000+
                    </div>
                    <div className="text-slate-600">Active Users</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      500+
                    </div>
                    <div className="text-slate-600">Law Firms</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      99.9%
                    </div>
                    <div className="text-slate-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-600">
                © 2025 Legal Connect. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LawyerWelcomePage;
