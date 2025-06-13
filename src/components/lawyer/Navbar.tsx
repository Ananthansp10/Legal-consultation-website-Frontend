import React, { useState } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white/60 backdrop-blur-lg shadow-md px-6 py-4 z-50 border-b border-[#e2e8f0]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-semibold text-[#334155]">Legal</span>
          <span className="text-2xl font-semibold text-[#3b82f6]">Connect</span>
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 hover:bg-white/50 rounded-lg px-3 py-2 transition-all duration-200"
          >
            <img
              src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-[#334155]">Sarah Johnson</p>
              <p className="text-xs text-[#64748b]">Corporate Lawyer</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-[#64748b] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/70 backdrop-blur-lg shadow-lg rounded-md py-2 border border-[#e2e8f0] transition-all ease-in-out duration-200">
              <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#334155] hover:bg-white/50 transition-colors">
                <User className="h-4 w-4" />
                My Profile
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#334155] hover:bg-white/50 transition-colors">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;