import { Lock, AlertCircle, Mail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AccountBlockPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");

  function gotoSignin() {
    if (role == "user") {
      navigate("/auth/signin");
    } else {
      navigate("/auth/lawyer/signin");
    }
  }

  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.03),transparent_50%)]"></div>

        {/* Main Card */}
        <div className="relative w-full max-w-md mx-auto animate-fade-in">
          <div className="backdrop-blur-xl bg-white/80 border border-gray-200/60 rounded-3xl shadow-2xl shadow-gray-900/10 p-8 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full shadow-lg">
                    <Lock className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                  Your Account Has Been Blocked
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto"></div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <p className="text-gray-600 text-base leading-relaxed">
                  Unfortunately, your account has been temporarily blocked due
                  to a violation of our terms. Please contact support for
                  further assistance.
                </p>

                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Account access restricted</span>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="pt-4">
                <button
                  onClick={gotoSignin}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-lg">Sign In</span>
                </button>
              </div>

              {/* Contact Support Link */}
              <div className="pt-2">
                <button className="group flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 mx-auto">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium border-b border-transparent group-hover:border-gray-400/50 transition-colors duration-200">
                    Contact Support
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-purple-400/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-24 left-16 w-3 h-3 bg-blue-300/15 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-40 right-20 w-1.5 h-1.5 bg-purple-300/20 rounded-full animate-float"></div>
      </div>
    </>
  );
}

export default AccountBlockPage;
