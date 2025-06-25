import React from 'react';
import { Sparkles } from 'lucide-react';

const WelcomeSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Welcome back, Ananthan SP!
          </h1>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl">
          Ready to help your clients navigate their legal challenges. Your expertise makes justice accessible to everyone.
        </p>
        <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-blue-700 font-medium border border-blue-200">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Available for consultations
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;