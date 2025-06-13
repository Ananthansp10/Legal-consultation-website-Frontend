import React from 'react';
import { Users, UserCheck, Calendar, AlertTriangle, TrendingUp, MessageSquare, Star } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import GlassCard from '../../components/admin/GlassCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 12 },
    { day: 'Tue', appointments: 19 },
    { day: 'Wed', appointments: 15 },
    { day: 'Thu', appointments: 22 },
    { day: 'Fri', appointments: 18 },
    { day: 'Sat', appointments: 8 },
    { day: 'Sun', appointments: 5 },
  ];

  const specialityData = [
    { name: 'Corporate Law', value: 35, color: '#3b82f6' },
    { name: 'Criminal Law', value: 25, color: '#10b981' },
    { name: 'Family Law', value: 20, color: '#f59e0b' },
    { name: 'Real Estate', value: 20, color: '#ef4444' },
  ];

  const topLawyers = [
    { 
      name: 'Dr. Sarah Johnson', 
      speciality: 'Corporate Law', 
      consultations: 145, 
      rating: 4.9,
      profileImage: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      name: 'John Martinez', 
      speciality: 'Criminal Law', 
      consultations: 128, 
      rating: 4.8,
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      name: 'Emily Chen', 
      speciality: 'Family Law', 
      consultations: 98, 
      rating: 4.7,
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  const topUsers = [
    { 
      name: 'Alice Cooper', 
      consultations: 24, 
      location: 'New York, NY',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      name: 'Bob Wilson', 
      consultations: 18, 
      location: 'Los Angeles, CA',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      name: 'Carol Davis', 
      consultations: 15, 
      location: 'Chicago, IL',
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  const recentMessages = [
    { 
      user: 'Alice Cooper', 
      message: 'Need help with contract review...', 
      time: '2 min ago',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      user: 'Bob Wilson', 
      message: 'Question about divorce proceedings...', 
      time: '5 min ago',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      user: 'Carol Davis', 
      message: 'Real estate closing issues...', 
      time: '10 min ago',
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      user: 'David Brown', 
      message: 'Criminal defense consultation...', 
      time: '15 min ago',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lawyers"
          value="156"
          icon={UserCheck}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value="2,847"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Appointments Today"
          value="24"
          icon={Calendar}
          trend={{ value: -3, isPositive: false }}
        />
        <StatCard
          title="Pending Verifications"
          value="8"
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Revenue Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Revenue Overview</h3>
          <div className="flex items-center space-x-2 text-green-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">+15% this month</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Weekly Appointments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Speciality Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Lawyer Specialities</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={specialityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {specialityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Top Lawyers & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Lawyers */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Performing Lawyers</h3>
          <div className="space-y-4">
            {topLawyers.map((lawyer, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
                <img
                  src={lawyer.profileImage}
                  alt={lawyer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{lawyer.name}</h4>
                  <p className="text-sm text-slate-600">{lawyer.speciality}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600">{lawyer.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{lawyer.consultations}</p>
                  <p className="text-sm text-slate-600">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Users */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Most Active Users</h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{user.name}</h4>
                  <p className="text-sm text-slate-600">{user.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{user.consultations}</p>
                  <p className="text-sm text-slate-600">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Messages */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Messages</h3>
          <MessageSquare className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-4">
          {recentMessages.map((message, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-white/50 rounded-lg transition-colors duration-200">
              <img
                src={message.profileImage}
                alt={message.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm">{message.user}</p>
                <p className="text-slate-600 text-sm truncate">{message.message}</p>
                <p className="text-xs text-slate-400 mt-1">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium">
          💬 View All Messages
        </button>
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;