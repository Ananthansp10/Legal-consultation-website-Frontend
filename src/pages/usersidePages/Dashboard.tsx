import Navbar from '../../components/userside/Navbar';
import WelcomeSection from '../../components/userside/WelcomeSection';
import BannerSlider from '../../components/userside/BannerSlider';
import UpcomingAppointments from '../../components/userside/UpcommingAppointments';
import QuickActions from '../../components/userside/QuickActions';
import RecentActivities from '../../components/userside/RecentActivities';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/user/profileService';


function Dashboard() {
  let userDetails:any=useSelector((state:any)=>state.auth.user)

  const userData = {
    name:userDetails?.name
  }

   const [userProfileData,setUserProfileData]:any=useState(null)

   useEffect(()=>{
      getProfile(userDetails?.id).then((response)=>{
        if(response.data.data){
          setUserProfileData(response.data.data)
        }
      })
  },[])


  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Navbar/>
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <WelcomeSection userName={userProfileData ? userProfileData.name : userData.name} />
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