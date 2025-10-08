import { Mail, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmailExistError() {
  let navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/auth/signin");
  };

  const handleTryDifferentEmail = () => {
    navigate("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Desktop Layout */}
        <div className="hidden lg:flex bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left side - Illustration */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <Mail className="w-16 h-16 text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-1 bg-blue-200 rounded mx-auto"></div>
                <div className="w-12 h-1 bg-blue-300 rounded mx-auto"></div>
                <div className="w-6 h-1 bg-blue-200 rounded mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 p-12 flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-slate-700 mb-4">
                Email Already Exists
              </h1>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                An account with this email already exists. Please sign in or use
                a different email to continue.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleSignIn}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>

                <button
                  onClick={handleTryDifferentEmail}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 border border-slate-200 hover:border-slate-300"
                >
                  Try a Different Email
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-lg mx-auto">
                <Mail className="w-12 h-12 text-blue-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-700 mb-4">
              Email Already Exists
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              An account with this email already exists. Please sign in or use a
              different email to continue.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>

            <button
              onClick={handleTryDifferentEmail}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              Try a Different Email
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default EmailExistError;
