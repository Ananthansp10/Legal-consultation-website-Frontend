import React, { useState } from 'react';
import { Home, User, CalendarPlus, CalendarCheck, MessageCircle, Star, Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: User, label: 'Clients', active: false },
    { icon: CalendarPlus, label: 'Schedule', active: false },
    { icon: CalendarCheck, label: 'Appointments', active: false },
    { icon: MessageCircle, label: 'Messages', active: false },
    { icon: Star, label: 'Reviews', active: false },
  ];

  const SidebarContent = () => (
    <div className="p-6 space-y-2">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            item.active
              ? 'bg-[#3b82f6] text-white shadow-md'
              : 'text-[#334155] hover:bg-blue-100 hover:text-[#3b82f6]'
          }`}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white/60 backdrop-blur-lg rounded-lg shadow-md border border-[#e2e8f0]"
      >
        <Menu className="h-5 w-5 text-[#334155]" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white/50 backdrop-blur-lg shadow-xl h-screen sticky top-16 border-r border-[#e2e8f0]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white/90 backdrop-blur-lg shadow-xl h-full">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#334155]" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;