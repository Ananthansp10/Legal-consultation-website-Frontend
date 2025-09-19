import { useEffect, useState } from 'react';
import { FileDown, DollarSign, Calendar, Users, UserCheck, Filter } from 'lucide-react';
import { getReports } from '../../services/admin/adminService';

interface SubscriptionReportData{
    _id:string;
    specializationCount:number
}

interface StateReportData{
    _id:string;
    usersCount:number;
}

interface LawyerDetailsData{
  name:string;
  specialization:string[];
  totalRevenue:number;
  totalAppointments:number;
  planName:string[];
  joinDate:Date;
}

interface KPIData {
  totalRevenue: number;
  totalAppointments: number;
  totalSubscribedLawyers: number;
  totalUsers: number;
  subscriptionPlanReport:SubscriptionReportData[];
  stateReport:StateReportData[];
  lawyerDetails:LawyerDetailsData[];
}

interface ChartData {
  monthlyRevenue: { month: string; revenue: number }[];
  appointmentsBySpecialization: { specialization: string; count: number; color: string }[];
  lawyersByPlan: { plan: string; count: number }[];
  usersByState: { state: string; count: number }[];
}

interface LawyerData {
  id: number;
  name: string;
  specialization: string;
  plan: string;
  revenue: number;
  appointments: number;
  joinDate: string;
}

function convertToDate(date:Date){
  return new Date(date).toISOString().split('T')[0]
}


const mockChartData: ChartData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 180000 },
    { month: 'Feb', revenue: 220000 },
    { month: 'Mar', revenue: 350000 },
    { month: 'Apr', revenue: 280000 },
    { month: 'May', revenue: 420000 },
    { month: 'Jun', revenue: 380000 },
    { month: 'Jul', revenue: 490000 },
    { month: 'Aug', revenue: 320000 },
    { month: 'Sep', revenue: 440000 },
    { month: 'Oct', revenue: 510000 },
    { month: 'Nov', revenue: 380000 },
    { month: 'Dec', revenue: 467650 },
  ],
  appointmentsBySpecialization: [
    { specialization: 'Criminal Law', count: 425, color: '#3B82F6' },
    { specialization: 'Corporate Law', count: 318, color: '#14B8A6' },
    { specialization: 'Family Law', count: 289, color: '#F97316' },
    { specialization: 'Civil Law', count: 424, color: '#8B5CF6' },
  ],
  lawyersByPlan: [
    { plan: 'Basic', count: 34 },
    { plan: 'Premium', count: 42 },
    { plan: 'Enterprise', count: 13 },
  ],
  usersByState: [
    { state: 'Maharashtra', count: 842 },
    { state: 'Delhi', count: 567 },
    { state: 'Karnataka', count: 423 },
    { state: 'Tamil Nadu', count: 389 },
    { state: 'Gujarat', count: 298 },
    { state: 'West Bengal', count: 267 },
    { state: 'Rajasthan', count: 234 },
    { state: 'Others', count: 401 },
  ],
};

const mockLawyerData: LawyerData[] = [
  {
    id: 1,
    name: 'Advocate Rajesh Kumar',
    specialization: 'Criminal Law',
    plan: 'Premium',
    revenue: 125000,
    appointments: 45,
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Advocate Priya Sharma',
    specialization: 'Corporate Law',
    plan: 'Enterprise',
    revenue: 89000,
    appointments: 32,
    joinDate: '2023-02-20',
  },
  {
    id: 3,
    name: 'Advocate Amit Patel',
    specialization: 'Family Law',
    plan: 'Basic',
    revenue: 67000,
    appointments: 28,
    joinDate: '2023-03-10',
  },
  {
    id: 4,
    name: 'Advocate Sunita Singh',
    specialization: 'Civil Law',
    plan: 'Premium',
    revenue: 98000,
    appointments: 38,
    joinDate: '2023-01-28',
  },
  {
    id: 5,
    name: 'Advocate Vikram Malhotra',
    specialization: 'Criminal Law',
    plan: 'Enterprise',
    revenue: 145000,
    appointments: 52,
    joinDate: '2022-11-12',
  },
  {
    id: 6,
    name: 'Advocate Meera Gupta',
    specialization: 'Corporate Law',
    plan: 'Premium',
    revenue: 112000,
    appointments: 41,
    joinDate: '2023-04-05',
  },
  {
    id: 7,
    name: 'Advocate Ravi Chandra',
    specialization: 'Family Law',
    plan: 'Basic',
    revenue: 54000,
    appointments: 22,
    joinDate: '2023-05-18',
  },
  {
    id: 8,
    name: 'Advocate Kavita Reddy',
    specialization: 'Civil Law',
    plan: 'Premium',
    revenue: 87000,
    appointments: 35,
    joinDate: '2023-02-14',
  },
];


const generatePDFReport = (
  kpiData: KPIData | null,
  chartData: ChartData,
  lawyerData: LawyerData[]
) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to download the PDF report.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Overall Report - PDF</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #14B8A6;
          padding-bottom: 20px;
          margin-bottom: 40px;
        }
        
        .header h1 {
          color: #14B8A6;
          font-size: 28px;
          margin: 0;
        }
        
        .header p {
          color: #666;
          margin: 10px 0 0 0;
          font-size: 14px;
        }
        
        .kpi-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .kpi-card {
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }
        
        .kpi-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .kpi-value {
          font-size: 24px;
          font-weight: bold;
          color: #111;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #111;
          margin: 40px 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #14B8A6;
        }
        
        .chart-data {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .chart-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .chart-item:last-child {
          border-bottom: none;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        
        .plan-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .plan-basic { background: #f3f4f6; color: #374151; }
        .plan-premium { background: #ccfbf1; color: #0f766e; }
        .plan-enterprise { background: #e9d5ff; color: #7c3aed; }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #666;
          font-size: 12px;
        }
        
        @media print {
          body { margin: 0; padding: 15mm; }
          .header { page-break-after: avoid; }
          table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Overall Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div class="kpi-section">
        <div class="kpi-card">
          <div class="kpi-title">Total Revenue</div>
          <div class="kpi-value">₹${kpiData?.totalRevenue.toLocaleString()}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Total Appointments</div>
          <div class="kpi-value">${kpiData?.totalAppointments.toLocaleString()}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Total Subscribed Lawyers</div>
          <div class="kpi-value">${kpiData?.totalSubscribedLawyers.toLocaleString()}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Total Users</div>
          <div class="kpi-value">${kpiData?.totalUsers.toLocaleString()}</div>
        </div>
      </div>

      <h2 class="section-title">Monthly Revenue Breakdown</h2>
      <div class="chart-data">
        ${chartData.monthlyRevenue.map(item => 
          `<div class="chart-item">
            <span>${item.month}</span>
            <span>₹${item.revenue.toLocaleString()}</span>
          </div>`
        ).join('')}
      </div>

      <h2 class="section-title">Appointments by Specialization</h2>
      <div class="chart-data">
        ${chartData.appointmentsBySpecialization.map(item => 
          `<div class="chart-item">
            <span>${item.specialization}</span>
            <span>${item.count} appointments</span>
          </div>`
        ).join('')}
      </div>

      <h2 class="section-title">Lawyer Subscriptions by Plan</h2>
      <div class="chart-data">
        ${chartData.lawyersByPlan.map(item => 
          `<div class="chart-item">
            <span>${item.plan}</span>
            <span>${item.count} lawyers</span>
          </div>`
        ).join('')}
      </div>

      <h2 class="section-title">Lawyer Details</h2>
      <table>
        <thead>
          <tr>
            <th>Lawyer Name</th>
            <th>Specialization</th>
            <th>Plan</th>
            <th>Revenue</th>
            <th>Appointments</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          ${lawyerData.map(lawyer => 
            `<tr>
              <td>${lawyer.name}</td>
              <td>${lawyer.specialization}</td>
              <td><span class="plan-badge plan-${lawyer.plan.toLowerCase()}">${lawyer.plan}</span></td>
              <td>₹${lawyer.revenue.toLocaleString()}</td>
              <td>${lawyer.appointments}</td>
              <td>${lawyer.joinDate}</td>
            </tr>`
          ).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated automatically by the Admin Dashboard System.</p>
        <p>For any queries, please contact the system administrator.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 1000);
};

function CompanyReportPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [specialization, setSpecialization] = useState('all');
  const [planType, setPlanType] = useState('all');

  const handlePDFDownload = () => {
    generatePDFReport(reports ? reports : null, mockChartData, mockLawyerData);
  };

  // Calculate chart dimensions
  const maxRevenue = Math.max(...mockChartData.monthlyRevenue.map(d => d.revenue));
  const maxLawyers = Math.max(...mockChartData.lawyersByPlan.map(d => d.count));
  const maxUsers = Math.max(...mockChartData.usersByState.map(d => d.count));

  const [reports,setReports]=useState<KPIData | null>()


useEffect(()=>{
    getReports().then((response)=>{
        setReports(response.data.data)
    })
},[])

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: `₹${reports?.totalRevenue.toLocaleString()}` || '',
      icon: DollarSign,
      color: 'bg-teal-500',
    },
    {
      title: 'Total Appointments',
      value: reports?.totalAppointments.toLocaleString() || '',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Subscribed Lawyers',
      value: reports?.totalSubscribedLawyers.toLocaleString() || '',
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Total Users',
      value: reports?.totalUsers.toLocaleString() || '',
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Overall Report</h1>
            <button
              onClick={handlePDFDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthy">Monthy</option>
                  <option value="yearly"></option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lawyer Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
                <option value="family">Family Law</option>
                <option value="civil">Civil Law</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Line Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {mockChartData.monthlyRevenue.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <div
                      className="w-full bg-teal-500 rounded-t transition-all duration-500 hover:bg-teal-600"
                      style={{
                        height: `${(item.revenue / maxRevenue) * 200}px`,
                        minHeight: '4px'
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                      {item.month}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments by Specialization Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Appointments by Specialization</h3>
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <svg width="180" height="180" className="transform -rotate-90">
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="20"
                  />
                  {mockChartData.appointmentsBySpecialization.map((item, index) => {
                    const total = mockChartData.appointmentsBySpecialization.reduce((sum, d) => sum + d.count, 0);
                    const percentage = (item.count / total) * 100;
                    const circumference = 2 * Math.PI * 70;
                    const strokeDasharray = circumference;
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;
                    
                    return (
                      <circle
                        key={index}
                        cx="90"
                        cy="90"
                        r="70"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                        transform={`rotate(${index * 90} 90 90)`}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockChartData.appointmentsBySpecialization.reduce((sum, d) => sum + d.count, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {mockChartData.appointmentsBySpecialization.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.specialization}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lawyer Subscriptions by Plan Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lawyer Subscriptions by Plan</h3>
            <div className="h-64 flex items-end justify-between space-x-4">
              {reports?.subscriptionPlanReport.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{
                      height: `${(item.specializationCount / reports.totalSubscribedLawyers) * 200}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-sm text-gray-700 mt-2 font-medium">{item._id}</span>
                  <span className="text-xs text-gray-500">{item.specializationCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Users by State Horizontal Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by State</h3>
            <div className="space-y-4">
              {reports?.stateReport.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-700 font-medium">{item._id}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(item.usersCount / reports.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">{item.usersCount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lawyer Details</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lawyer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue Contribution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.lawyerDetails.map((lawyer) => (
                  <tr key={lawyer.name} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lawyer.specialization[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lawyer.planName[0] === 'Standard Plan' 
                          ? 'bg-purple-100 text-purple-800'
                          : lawyer.planName[0] === 'Premium Plan'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lawyer.planName[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{lawyer.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.floor(lawyer.totalAppointments/2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {convertToDate(lawyer.joinDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PDF Report Section */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-sm p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Generate Complete Report</h3>
          <p className="text-teal-100 mb-6 text-lg">
            Download a comprehensive PDF report with all charts, data tables, and analytics
          </p>
          <button
            onClick={handlePDFDownload}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 transform hover:scale-105"
          >
            <FileDown className="h-6 w-6 mr-3" />
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyReportPage;