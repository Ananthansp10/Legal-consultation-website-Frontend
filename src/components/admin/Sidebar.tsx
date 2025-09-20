import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  UserCircle
} from 'lucide-react';

const sidebarItems = [
  { path: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin-dashboard/lawyer-verification', icon: UserCheck, label: 'Lawyer Verification' },
  { path: '/admin-dashboard/lawyers', icon: UserCircle, label: 'Lawyers' },
  { path: '/admin-dashboard/users', icon: Users, label: 'Users' },
  { path: '/admin-dashboard/admin/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/admin-dashboard/specialization', icon: Calendar, label: 'Specialization' },
  { path: '/admin-dashboard/reported-accounts', icon: FileText, label: 'Reports' },
  { path: '/admin-dashboard/admin/subscription-plans', icon: DollarSign, label: 'Plans' },
  // { path: '/revenue', icon: DollarSign, label: 'Revenue' },
  { path: '/admin-dashboard/company-report', icon: Settings, label: 'Company Report' }
];

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/70 backdrop-blur-md border-r border-slate-200 z-40 mt-3">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-white/80 hover:text-blue-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;