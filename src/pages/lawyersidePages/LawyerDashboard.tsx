
import Navbar from '../../components/lawyer/Navbar';
import Sidebar from '../../components/lawyer/Sidebar';
import StatsCards from '../../components/lawyer/AppointmentsChart';
import AppointmentsChart from '../../components/lawyer/AppointmentsChart';
import UpcomingAppointments from '../../components/lawyer/UpcomingAppointments';
import RecentMessages from '../../components/lawyer/RecentMessages';
import Footer from '../../components/Footer';

function LawyerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6 lg:p-8 space-y-8">
          {/* Welcome Section */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#334155] mb-2">
                  Welcome back, Sarah! 👋
                </h1>
                <p className="text-[#64748b]">
                  Here's what's happening with your practice today.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#64748b]">Today's Date</p>
                <p className="text-lg font-semibold text-[#334155]">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Charts and Appointments Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AppointmentsChart />
            <UpcomingAppointments />
          </div>

          {/* Recent Messages */}
          <RecentMessages />

          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-[#e2e8f0]">
            <h2 className="text-xl font-semibold text-[#334155] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-[#3b82f6] text-white p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="font-medium">Schedule Meeting</p>
                </div>
              </button>
              <button className="bg-[#10b981] text-white p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <p className="font-medium">Add New Client</p>
                </div>
              </button>
              <button className="bg-[#f59e0b] text-white p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-medium">Create Document</p>
                </div>
              </button>
              <button className="bg-[#8b5cf6] text-white p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-200 hover:shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-medium">Generate Invoice</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
       <Footer/>
    </div>
    
  );
}

export default LawyerDashboard;