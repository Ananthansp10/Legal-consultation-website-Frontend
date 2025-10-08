import { useEffect, useState } from "react";
import {
  FileDown,
  DollarSign,
  Calendar,
  Users,
  UserCheck,
  Filter,
} from "lucide-react";
import { getReports } from "../../services/admin/adminService";

interface SubscriptionReportData {
  _id: string;
  specializationCount: number;
}

interface StateReportData {
  _id: string;
  usersCount: number;
}

interface LawyerDetailsData {
  name: string;
  specialization: string[];
  totalRevenue: number;
  totalAppointments: number;
  planName: string[];
  joinDate: Date;
}

interface RevenueChartData {
  _id: { day: number; month: number | string; year: number; week: number };
  totalRevenue: number;
  year: number;
  month: string;
}

interface SpecializationChartData {
  _id: string;
  specializationCount: number;
}

interface KPIData {
  totalRevenue: number;
  totalAppointments: number;
  totalSubscribedLawyers: number;
  totalUsers: number;
  subscriptionPlanReport: SubscriptionReportData[];
  stateReport: StateReportData[];
  lawyerDetails: LawyerDetailsData[];
  revenueDateChart: RevenueChartData[];
  specializationChart: SpecializationChartData[];
}

function convertToDate(date: any) {
  return new Date(date).toISOString().split("T")[0];
}

function getColour(count: number) {
  if (count < 2) {
    return "#3B82F6";
  } else if (count == 3) {
    return "#F97316";
  } else {
    return "#14B8A6";
  }
}

const generatePDFReport = (
  kpiData: KPIData | null,
  revenueData: RevenueChartData[] | null,
  specializationData: SpecializationChartData[] | null,
  sunscriptionPlanData: SubscriptionReportData[] | null,
  lawyerData: LawyerDetailsData[] | undefined,
  dateRange: string,
) => {
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
        <p>Generated on ${new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
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
        ${revenueData
          ?.map(
            (item) =>
              `<div class="chart-item">
            <span>${
              dateRange == "Daily"
                ? item._id.day + "-" + item._id.month + "-" + item._id.year
                : dateRange === "Weekly"
                  ? "Week " + item._id.week + ", " + item._id.year
                  : dateRange === "Monthly"
                    ? item.month + " " + item.year
                    : dateRange === "Yearly"
                      ? item.year
                      : item.totalRevenue
            }</span>
            <span>₹${item.totalRevenue.toLocaleString()}</span>
          </div>`,
          )
          .join("")}
      </div>

      <h2 class="section-title">Appointments by Specialization</h2>
      <div class="chart-data">
        ${specializationData
          ?.map(
            (item) =>
              `<div class="chart-item">
            <span>${item._id}</span>
            <span>${item.specializationCount} appointments</span>
          </div>`,
          )
          .join("")}
      </div>

      <h2 class="section-title">Lawyer Subscriptions by Plan</h2>
      <div class="chart-data">
        ${sunscriptionPlanData
          ?.map(
            (item) =>
              `<div class="chart-item">
            <span>${item._id}</span>
            <span>${item.specializationCount} lawyers</span>
          </div>`,
          )
          .join("")}
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
          ${lawyerData
            ?.map(
              (lawyer) =>
                `<tr>
              <td>${lawyer?.name}</td>
              <td>${lawyer?.specialization}</td>
              <td><span class="plan-badge plan-${lawyer?.planName[0]}">${
                lawyer?.planName[0]
              }</span></td>
              <td>₹${lawyer?.totalRevenue?.toLocaleString()}</td>
              <td>${lawyer?.totalAppointments}</td>
              <td>${lawyer?.joinDate}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated automatically by the Admin Dashboard System.</p>
        <p>For any queries, please contact the system administrator.</p>
      </div>
    </body>
    </html>
  `;

  // Create a Blob with the HTML content
  const blob = new Blob([html], { type: "text/html" });

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = `overall-report-${new Date().toISOString().split("T")[0]}.html`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
function CompanyReportPage() {
  const [dateRange, setDateRange] = useState("Daily");
  const [specialization, setSpecialization] = useState("All");

  const [reports, setReports] = useState<KPIData | null>();

  useEffect(() => {
    getReports(dateRange, specialization).then((response) => {
      console.log(response.data.data);
      setReports(response.data.data);
    });
  }, [dateRange, specialization]);

  const handlePDFDownload = () => {
    generatePDFReport(
      reports ? reports : null,
      reports?.revenueDateChart || [],
      reports?.specializationChart || [],
      reports?.subscriptionPlanReport || [],
      reports?.lawyerDetails,
      dateRange,
    );
  };

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${reports?.totalRevenue.toLocaleString()}` || "",
      icon: DollarSign,
      color: "bg-teal-500",
    },
    {
      title: "Total Appointments",
      value: reports?.totalAppointments.toLocaleString() || "",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Total Subscribed Lawyers",
      value: reports?.totalSubscribedLawyers.toLocaleString() || "",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Total Users",
      value: reports?.totalUsers.toLocaleString() || "",
      icon: Users,
      color: "bg-purple-500",
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
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
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
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthy">Monthy</option>
                  <option value="Yearly">Yearly</option>
                  <option value="All">All Time</option>
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
                <option value="All">All Specializations</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Civil Law">Civil Law</option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Line Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {reports?.revenueDateChart &&
              reports.revenueDateChart.length > 0 ? (
                (() => {
                  const maxRevenue = Math.max(
                    ...reports.revenueDateChart.map((r) => r.totalRevenue),
                  );
                  return reports.revenueDateChart.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-teal-500 rounded-t transition-all duration-500 hover:bg-teal-600"
                        style={{
                          height: `${(item.totalRevenue / maxRevenue) * 200}px`,
                          minHeight: "4px",
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2 whitespace-nowrap">
                        {dateRange == "Daily"
                          ? `${item._id.day}/${item._id.month}/${item._id.year}`
                          : dateRange == "Weekly"
                            ? `${item._id.week}/${item._id.year}`
                            : dateRange == "Monthly"
                              ? `${item._id.week}/${item._id.year}`
                              : dateRange == "Yearly"
                                ? `${item.year}`
                                : `${item.totalRevenue}`}
                      </span>
                    </div>
                  ));
                })()
              ) : (
                <div className="text-gray-400 text-sm">
                  No revenue data for the selected range
                </div>
              )}
            </div>
          </div>

          {/* Appointments by Specialization Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Appointments by Specialization
            </h3>
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
                  {(reports?.specializationChart || []).map((item, index) => {
                    const total =
                      reports?.specializationChart.reduce(
                        (sum, d) => sum + d.specializationCount,
                        0,
                      ) || 1;
                    const percentage = (item.specializationCount / total) * 100;
                    const circumference = 2 * Math.PI * 70;
                    const strokeDasharray = circumference;
                    const strokeDashoffset =
                      circumference - (percentage / 100) * circumference;

                    return (
                      <circle
                        key={index}
                        cx="90"
                        cy="90"
                        r="70"
                        fill="none"
                        stroke={getColour(item.specializationCount)}
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
                      {reports?.specializationChart.reduce(
                        (sum, d) => sum + d.specializationCount,
                        0,
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {reports?.specializationChart.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: getColour(item.specializationCount),
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">{item._id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lawyer Subscriptions by Plan Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Lawyer Subscriptions by Plan
            </h3>
            <div className="h-64 flex items-end justify-between space-x-4">
              {reports?.subscriptionPlanReport.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{
                      height: `${
                        (item.specializationCount /
                          reports.totalSubscribedLawyers) *
                        200
                      }px`,
                      minHeight: "4px",
                    }}
                  ></div>
                  <span className="text-sm text-gray-700 mt-2 font-medium">
                    {item._id}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.specializationCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Users by State Horizontal Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Users by State
            </h3>
            <div className="space-y-4">
              {reports?.stateReport.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-700 font-medium">
                    {item._id}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (item.usersCount / reports.totalUsers) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {item.usersCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Lawyer Details
            </h3>
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
                  <tr
                    key={lawyer.name}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lawyer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lawyer.specialization[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lawyer.planName[0] === "Standard Plan"
                            ? "bg-purple-100 text-purple-800"
                            : lawyer.planName[0] === "Premium Plan"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {lawyer.planName[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{lawyer.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.floor(lawyer.totalAppointments / 2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {convertToDate(lawyer.joinDate || "")}
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
            Download a comprehensive PDF report with all charts, data tables,
            and analytics
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
