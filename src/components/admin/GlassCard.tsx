import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl
        ${hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;