import Navbar from '../../components/lawyer/Navbar';
import WelcomeSection from '../../components/lawyer/WelcomeSection';
import ImageSlider from '../../components/lawyer/ImageSlider';
import QuickActions from '../../components/lawyer/QuickActions';
import UpcomingAppointments from '../../components/lawyer/UpcommingAppointments';
import RecentActivity from '../../components/lawyer/RecentActivity';
import Footer from '../../components/lawyer/Footer';

function LawyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />
        <ImageSlider />
        <QuickActions />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <UpcomingAppointments />
          </div>
          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default  LawyerDashboard;