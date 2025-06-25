import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, Search, Lock, User, AlertCircle, Mail } from 'lucide-react';

function LawyerVerificationStatusPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      {/* Glassmorphism Status Card */}
      <div 
        className={`glass-card w-full max-w-2xl transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Animated Hourglass Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Clock 
              size={64} 
              className="text-blue-500 pulse-animation mx-auto"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl font-bold text-slate-700 text-center mb-4">
          Verification Pending
        </h1>

        {/* Subtext */}
        <p className="text-slate-600 text-center mb-8 text-lg leading-relaxed">
          Your account is currently under admin review.<br />
          You'll receive access to your dashboard once approved.
        </p>

        {/* Details Box */}
        <div className="bg-slate-100/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-200/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">Reason:</span>
                <span className="text-slate-600 ml-2">Awaiting qualification document verification</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">Estimated Time:</span>
                <span className="text-slate-600 ml-2">Within 24 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">Verification Progress</h3>
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-300 -translate-y-1/2 z-0">
              <div className="h-full bg-blue-500 w-1/3 transition-all duration-1000 ease-out"></div>
            </div>
            
            {/* Steps */}
            <div className="flex items-center justify-between w-full relative z-10">
              {/* Step 1: Sign Up - Completed */}
              <div className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 text-center">Sign Up</span>
              </div>

              {/* Step 2: Admin Review - In Progress */}
              <div className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2 shadow-lg pulse-slow">
                  <Search size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 text-center">Admin Review</span>
              </div>

              {/* Step 3: Approval - Pending */}
              <div className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-lg">
                <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle size={20} className="text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-500 text-center">Approval</span>
              </div>

              {/* Step 4: Access Dashboard - Pending */}
              <div className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-lg">
                <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center mb-2">
                  <User size={20} className="text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-500 text-center">Dashboard Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Admin Link */}
        <div className="text-right">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 hover:underline group"
          >
            <Mail size={16} className="group-hover:scale-110 transition-transform duration-200" />
            Need help? Contact Admin
          </a>
        </div>
      </div>
    </div>
  );
}

export default LawyerVerificationStatusPage;