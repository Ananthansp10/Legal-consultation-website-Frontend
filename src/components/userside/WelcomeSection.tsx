import React from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/20 mb-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-4">
          Welcome back, {userName}!
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          Ready to connect with top lawyers today?
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;