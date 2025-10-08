import React from "react";
import { Zap } from "lucide-react";

interface LoaderProps {
  showText?: boolean;
  brandText?: string;
}

const Loader: React.FC<LoaderProps> = ({
  showText = true,
  brandText = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Animated background shimmer */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"></div>
      </div>

      {/* Glassmorphism container */}
      <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
        {/* Background blur effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6 lg:space-y-8">
          {/* Brand logo */}
          <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-float">
            <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-white drop-shadow-sm" />
          </div>

          {/* Spinner container */}
          <div className="relative flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-spin shadow-lg">
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-50 to-blue-50"></div>
            </div>

            {/* Inner pulsing dot */}
            <div className="absolute w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>

            {/* Glow effect */}
            <div className="absolute w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-blue-400/20 animate-ping"></div>
          </div>

          {/* Loading text */}
          {showText && (
            <div className="text-center space-y-2">
              <p className="text-slate-600 font-medium text-lg lg:text-xl tracking-wide">
                {brandText}
              </p>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Additional glow effects */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Loader;
