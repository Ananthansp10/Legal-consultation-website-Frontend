import React from 'react';
import { Scale, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="relative mb-8">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl scale-150" />

        {/* Icon container */}
        <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl">
          <Scale className="w-16 h-16 text-slate-400" />
        </div>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent mb-3">
          No Specializations Added
        </h3>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Get started by adding your first legal specialization to organize your practice areas.
        </p>

        <button
          onClick={onAddClick}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Add Your First Specialization</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;