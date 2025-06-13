import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

interface NavbarProps {
  userName: string;
  userAvatar: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('My Appointments');

  const navLinks = ['Lawyers', 'My Appointments', 'Chat'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
              LegalConnect
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveLink(link)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeLink === link
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="text-sm font-medium text-slate-700">{userName}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200/20 py-2">
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/50 transition-colors">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-red-50/50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg rounded-lg mt-2 shadow-xl border border-gray-200/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setActiveLink(link);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeLink === link
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200/20">
              <div className="flex items-center px-5">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-slate-700">{userName}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-md transition-colors">
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </button>
                <button className="flex items-center space-x-3 w-full px-3 py-2 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/50 rounded-md transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;