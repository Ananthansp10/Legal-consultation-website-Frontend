import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Star,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import GlassCard from "../../components/admin/GlassCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getSummaryReport } from "../../services/admin/adminService";

const AdminDashboard: React.FC = () => {
  function getColour(avg: number) {
    if (avg >= 90 && avg < 100) {
      return "#ef4444";
    }
    if (avg >= 1 && avg <= 10) {
      return "#f59e0b";
    }
    if (avg <= 0) {
      return "#10b981";
    }
    return "#3b82f6";
  }

  interface RevenueData {
    month: number;
    revenue: number;
  }

  interface RevenueChart {
    _id: RevenueData;
    revenue: number;
  }

  interface WeeklyAppointmentsData {
    dayName: string;
    appointmentsCount: number;
  }

  interface SpecializationData {
    specializationName: string;
    average: number;
  }

  interface TopLawyersData {
    name: string;
    profileImage: string;
    specialization: string;
    totalConsultation: number;
    rating: number;
  }

  interface TopUserData {
    name: string;
    profileImage: string;
    state: string;
    country: string;
    totalConsultation: number;
  }

  interface StateChartData {
    _id: string;
    consultations: number;
  }

  interface CountryChartData {
    _id: string;
    consultations: number;
  }

  interface SummaryReport {
    totalUsers: number;
    totalLawyers: number;
    todaysAppointments: number;
    pendingVerification: number;
    revenueChart: RevenueChart[];
    weeklyAppointments: WeeklyAppointmentsData[];
    specializationChart: SpecializationData[];
    topLawyers: TopLawyersData[];
    topUsers: TopUserData[];
    stateChart: StateChartData[];
    countryChart: CountryChartData[];
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [summaryReport, setSummaryReport] = useState<SummaryReport | null>(
    null,
  );

  useEffect(() => {
    getSummaryReport().then((response) => {
      setSummaryReport(response.data.data);
    });
  }, []);

  const revenueChartObj = summaryReport?.revenueChart.map((data) => {
    return {
      month: months[data._id.month - 1],
      revenue: data.revenue,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Lawyers"
          value={summaryReport?.totalLawyers || 0}
          icon={UserCheck}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Users"
          value={summaryReport?.totalUsers || 0}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Appointments Today"
          value={summaryReport?.todaysAppointments || 0}
          icon={Calendar}
          trend={{ value: -3, isPositive: false }}
        />
        <StatCard
          title="Pending Verifications"
          value={summaryReport?.pendingVerification || 0}
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Revenue Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Revenue Overview
          </h3>
          <div className="flex items-center space-x-2 text-green-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">+15% this month</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueChartObj || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Weekly Appointments
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summaryReport?.weeklyAppointments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dayName" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar
                dataKey="appointmentsCount"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Speciality Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Lawyer Specialities
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summaryReport?.specializationChart || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ specializationName, average }) =>
                  `${specializationName}: ${average}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="average"
              >
                {summaryReport?.specializationChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColour(entry.average)} />
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
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Top Performing Lawyers
          </h3>
          <div className="space-y-4">
            {summaryReport?.topLawyers.map((lawyer, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200"
              >
                <img
                  src={lawyer.profileImage}
                  alt={lawyer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    {lawyer.name}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {lawyer.specialization}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-slate-600">
                      {lawyer.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {lawyer.totalConsultation}
                  </p>
                  <p className="text-sm text-slate-600">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Users */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">
            Most Active Users
          </h3>
          <div className="space-y-4">
            {summaryReport?.topUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200"
              >
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{user.name}</h4>
                  <p className="text-sm text-slate-600">
                    {user.country},{user.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {user.totalConsultation}
                  </p>
                  <p className="text-sm text-slate-600">consultations</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Geographical Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Insights */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                State Insights
              </h3>
              <p className="text-slate-600 text-sm">
                Consultations by Indian states
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summaryReport?.stateChart}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="stateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="_id"
                tick={{ fontSize: 12, fill: "#64748b" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="consultations"
                fill="url(#stateGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Country Insights */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Country Insights
              </h3>
              <p className="text-slate-600 text-sm">
                Global consultation distribution
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient
                  id="countryGradient0"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="countryGradient1"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="countryGradient2"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="countryGradient3"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#D97706" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient
                  id="countryGradient4"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Pie
                data={summaryReport?.countryChart}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="consultations"
              >
                {[0, 1, 2, 3, 4].map((index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#countryGradient${index})`}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${value} consultations (${
                    value * 10 > 100 ? 100 : value * 10
                  }%)`,
                  props.payload.country,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {summaryReport?.countryChart.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "red" }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item._id}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {item.consultations * 10 > 100
                    ? 100
                    : item.consultations * 10}
                  % ({item.consultations})
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
