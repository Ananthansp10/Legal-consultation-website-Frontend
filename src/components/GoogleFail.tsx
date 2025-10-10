import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GoogleFail() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    window.open("http://localhost:5000/api/user/auth/google", "_self");
  };

  const handleGoBack = () => {
    navigate("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Illustration */}
            <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 to-slate-100 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                {/* Animated Error Illustration */}
                <div className="relative mb-6">
                  <div className="animate-bounce">
                    <div className="relative inline-block">
                      {/* Broken Shield/Lock Illustration */}
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle
                            className="w-16 h-16 lg:w-20 lg:h-20 text-red-500"
                            strokeWidth={1.5}
                          />
                        </div>
                        {/* Broken pieces effect */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-200 rounded-full animate-pulse opacity-75"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-200 rounded-full animate-pulse opacity-60 delay-200"></div>
                        <div className="absolute top-1/2 -right-3 w-3 h-3 bg-red-200 rounded-full animate-pulse opacity-50 delay-500"></div>
                      </div>

                      {/* Google Colors Decoration */}
                      <div className="flex justify-center space-x-2 mt-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                {/* Error Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-6">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Authentication Error
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-700 mb-4 leading-tight">
                  Authentication Failed
                </h1>

                {/* Error Message */}
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  We couldn't log you in with Google. Please try again or use
                  another method.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* Try Again Button */}
                  <button
                    onClick={handleTryAgain}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:translate-y-[-1px] transition-all duration-200 flex items-center justify-center group"
                  >
                    <RefreshCw className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" />
                    Try Again with Google
                  </button>

                  {/* Go Back Link */}
                  <button
                    onClick={handleGoBack}
                    className="w-full text-slate-600 hover:text-slate-800 font-medium py-3 px-6 rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center justify-center group border-2 border-slate-200 hover:border-slate-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:translate-x-[-2px] transition-transform duration-200" />
                    Go back to Login
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600">
                    <strong>Need help?</strong> Contact our support team if you
                    continue experiencing issues.
                  </p>
                </div>

                {/* Optional: Error Code for Development */}
                {/* {process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-mono">
                      Error Code: AUTH_GOOGLE_FAILED_001
                    </p>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Optional: Additional Information Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Having trouble? Check your internet connection or try refreshing the
            page.
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-50/20 to-transparent rounded-full transform rotate-12"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-slate-100/30 to-transparent rounded-full transform -rotate-12"></div>
      </div>
    </div>
  );
}

export default GoogleFail;
