import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  Search,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";

function LawyerVerificationStatusPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    setStatusMessage(
      "Your verification is pending. You'll be notified via email once it's approved.",
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-3xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-8 backdrop-blur-xl transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Clock size={64} className="text-blue-600 animate-pulse" />
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Verification In Progress
        </h1>
        <p className="text-center text-slate-600 mb-6 text-base">
          Our admin team is currently reviewing your profile and documents.
        </p>

        {/* Status Message Box */}
        {statusMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-8 shadow">
            {statusMessage}
          </div>
        )}

        {/* Timeline */}
        <div className="mb-10">
          <h3 className="text-center text-lg font-semibold text-slate-700 mb-4">
            Verification Progress
          </h3>
          <div className="flex items-center justify-between relative px-2">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 z-0 transform -translate-y-1/2">
              <div className="h-full bg-blue-500 w-1/3 transition-all duration-1000 ease-in-out"></div>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between w-full z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md mb-2">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center">
                  Sign Up
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md mb-2 animate-pulse">
                  <Search size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center">
                  Admin Review
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-md mb-2">
                  <CheckCircle size={20} className="text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-500 text-center">
                  Approval
                </span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shadow-md mb-2">
                  <User size={20} className="text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-500 text-center">
                  Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Info Box */}
        <div className="bg-slate-100/70 p-5 rounded-xl border border-slate-200 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Reason:</span> Qualification
              documents are under review by the admin.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="text-blue-500 mt-1" size={20} />
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Estimated Time:</span> Usually
              within 24 hours of submission.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="text-green-600 mt-1" size={20} />
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Notification:</span> You will
              receive an email once your verification is complete.
            </p>
          </div>
        </div>

        {/* Contact Admin */}
        <div className="text-center">
          <a
            href="#"
            className="text-blue-600 text-sm hover:text-blue-700 font-medium transition hover:underline inline-flex items-center gap-1"
          >
            <Mail size={16} />
            Need help? Contact Admin
          </a>
        </div>
      </div>
    </div>
  );
}

export default LawyerVerificationStatusPage;
