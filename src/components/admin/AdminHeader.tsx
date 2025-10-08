import React from "react";
import { Plus, Sparkles } from "lucide-react";

interface AdminHeaderProps {
  onAddClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Manage Specializations
          </h1>
        </div>
        <p className="text-slate-600 text-lg font-medium ml-14">
          Create and manage legal practice areas with precision
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Plus className="w-5 h-5 relative z-10" />
        <span className="hidden sm:inline">Add Specialization</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default AdminHeader;
