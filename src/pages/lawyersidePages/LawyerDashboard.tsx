import LawyerNavbar from '../../components/lawyer/Navbar';
import WelcomeSection from '../../components/lawyer/WelcomeSection';
import ImageSlider from '../../components/lawyer/ImageSlider';
import QuickActions from '../../components/lawyer/QuickActions';
import UpcomingAppointments from '../../components/lawyer/SummaryDashboard';
import RecentActivity from '../../components/lawyer/RecentActivity';
import Footer from '../../components/lawyer/Footer';
import SummaryDashboard from '../../components/lawyer/SummaryDashboard';

function LawyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LawyerNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />
        <ImageSlider />
        <QuickActions />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="xl:col-span-2">
           <SummaryDashboard/>
          </div>
          <div className="xl:col-span-1">
            {/* <RecentActivity /> */}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default  LawyerDashboard;