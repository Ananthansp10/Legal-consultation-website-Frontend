import { CalendarCheck, IndianRupeeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSummary } from '../../services/lawyer/lawyerService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Consultations {
  id: string | null;
  count?: number;
  revenue?: number;
  month?: string;
}

interface GraphDate {
  month: number;
  year: number;
}

interface Summary {
  totalConsultations: Consultations[];
  pendingConsultations: Consultations[];
  upcomingConsultations: Consultations[];
  cancelledConsultations: Consultations[];
  rejectedConsultations: Consultations[];
  completedConsultations: Consultations[];
  totalRevenue: Consultations[];
  graphData?: {
    _id: GraphDate;
    count: number;
    revenue: number;
  }[];
}

const SummaryDashboard = () => {
  const lawyerId: string | undefined = useSelector((state: RootState) => state.lawyerAuth.lawyer?._id);
  const [summary, setSummary] = useState<Summary>();

  useEffect(() => {
    getSummary(lawyerId!).then((response) => {
      setSummary(response.data.data);
    });
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = summary?.graphData?.map((date) => {
    return {
      month: monthNames[date._id.month],
      year: date._id.year,
      revenue: date.revenue
    }
  })

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Consultation Overview</h2>
      <div className="flex flex-wrap gap-6 mb-8">
        {/* All your stats cards */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.totalConsultations?.[0]?.count}</span>
            <span className="text-slate-600 text-sm">Total Consultations</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.pendingConsultations?.[0]?.count || 0}</span>
            <span className="text-slate-600 text-sm">Pending Consultations</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.upcomingConsultations?.[0]?.count || 0}</span>
            <span className="text-slate-600 text-sm">Upcoming Consultations</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.completedConsultations?.[0]?.count || 0}</span>
            <span className="text-slate-600 text-sm">Completed Consultations</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.cancelledConsultations?.[0]?.count || 0}</span>
            <span className="text-slate-600 text-sm">Cancelled Consultations</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
          <div>
            <span className="block text-3xl font-bold text-blue-700">{summary?.rejectedConsultations?.[0]?.count || 0}</span>
            <span className="text-slate-600 text-sm">Rejected Consultations</span>
          </div>
        </div>
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-md flex-1">
          <IndianRupeeIcon className="h-8 w-8 text-green-600" />
          <div>
            <span className="block text-3xl font-bold text-green-700">{summary?.totalRevenue?.[0]?.revenue || 0}</span>
            <span className="text-slate-600 text-sm">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Professional Graph for Revenue */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData || []}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#38b2ac" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryDashboard;
