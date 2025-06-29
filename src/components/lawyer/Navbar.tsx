import React, { useState } from 'react';
import { Menu, X, User, Settings, LogOut, Key } from 'lucide-react';
import { useSelector } from 'react-redux';
import { logout } from '../../services/lawyer/authService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { lawyerLogout } from '../../redux/slices/lawyerAuthSlice';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const lawyer=useSelector((state:any)=>state.lawyerAuth.lawyer)

  const dispatch=useDispatch()
  const navigate=useNavigate()

  function logoutLawyer(){
    logout().then((response)=>{
      dispatch(lawyerLogout)
      toast.success(response.data.message)
      navigate('/auth/lawyer/signin')
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-800">LegalConnect</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Home', 'Appointments', 'Schedule', 'Reviews', 'Chat'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/70 transition-all duration-200"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Profile"
                  />
                  <span className="text-sm font-medium text-slate-700">{lawyer?.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <User className="mr-3 h-4 w-4" />
                        My Profile
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Key className="mr-3 h-4 w-4" />
                        Reset Password
                      </a>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={logoutLawyer}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-white/50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'Appointments', 'Schedule', 'Reviews', 'Chat'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Profile"
              />
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800">Ananthan SP</div>
                <div className="text-sm font-medium text-slate-500">Legal Consultant</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <User className="mr-3 h-5 w-5" />
                My Profile
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Key className="mr-3 h-5 w-5" />
                Reset Password
              </a>
              <a
                href="#"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;