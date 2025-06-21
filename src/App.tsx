import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import ForgotPassword from './components/auth/ForgotPassword';
import OTPVerification from './components/auth/OTPVerification';
import Dashboard from './pages/usersidePages/Dashboard';
import SignupForm from './components/lawyer/SignupForm';
import LawyerDashboard from './pages/lawyersidePages/LawyerDashboard';
import Login from './pages/adminsidePages/Login';
import Layout from './components/admin/Layout';
import AdminDashboard from './pages/adminsidePages/AdminDashboard';
import LawyerVerification from './pages/adminsidePages/LawyerVerification';
import LawyerListing from './pages/adminsidePages/LawyerListing';
import UserListing from './pages/adminsidePages/UserListing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewPasswordPage from '../../Front-end/src/components/auth/NewPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Authentication Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/otp-verification" element={<OTPVerification />} />
          <Route path='/auth/new-password' element={<NewPasswordPage/>}/>
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/lawyer/signup" element={<SignupForm/>} />
          <Route path="/lawyer-dashboard" element={<LawyerDashboard/>} />

          <Route element={<ProtectedRoute allowedRoles={['user']}/>}>
              <Route path="/user-dashboard" element={<Dashboard/>} />
          </Route>

          <Route path="/admin" element={<Login/>} />
        <Route path="/admin-dashboard" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="lawyer-verification" element={<LawyerVerification />} />
          <Route path="lawyers" element={<LawyerListing />} />
          <Route path="users" element={<UserListing />} />
        </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        
      </div>
    </Router>
  );
}

export default App;