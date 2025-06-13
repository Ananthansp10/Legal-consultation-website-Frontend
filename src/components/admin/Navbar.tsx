import React from 'react';
import { Scale, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold">
            <span className="text-slate-700">Legal</span>
            <span className="text-blue-500">Connect</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/60 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Admin</span>
          </div>
          <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-500 transition-colors duration-200">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;