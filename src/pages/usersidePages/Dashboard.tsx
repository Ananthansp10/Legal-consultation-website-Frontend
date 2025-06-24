
import Navbar from '../../components/userside/Navbar';
import WelcomeSection from '../../components/userside/WelcomeSection';
import BannerSlider from '../../components/userside/BannerSlider';
import UpcomingAppointments from '../../components/userside/UpcommingAppointments';
import QuickActions from '../../components/userside/QuickActions';
import RecentActivities from '../../components/userside/RecentActivities';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getGoogleAuthDetails } from '../../services/user/authService';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

function Dashboard() {
  let userDetails=useSelector((state:any)=>state.auth.user)
  let dispatch=useDispatch()
  const userData = {
    name:userDetails?.name,
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

    useEffect(()=>{
      if(!userDetails){
        getGoogleAuthDetails().then((response)=>{
        if(response.data.result){
          localStorage.setItem('user',response.data.result)
          dispatch(login(response.data.result))
        }
      })
      }
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Navbar userName={userData.name} userAvatar={userData.avatar} />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <WelcomeSection userName={userData.name} />
          </div>

          {/* Banner Slider */}
          <BannerSlider />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <UpcomingAppointments />
              <QuickActions />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <RecentActivities />
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}

export default Dashboard;