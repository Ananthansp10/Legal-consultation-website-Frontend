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
import UnAuthorizedPage from './components/UnAuthorizedPage';
import GoogleFail from './components/GoogleFail';
import EmailExistError from './components/EmailExistError';
import LawyerWelcomePage from './pages/lawyersidePages/LawyerWelcomePage';
import LawyerSignin from './components/lawyer/LawyerSignin';
import LawyerVerificationStatusPage from './components/lawyer/LawyerVerificationStatusPage';
import AdminWelcomePage from './pages/adminsidePages/AdminWelcomePage';
import AccountBlockPage from './components/AccountBlockPage';
import LawyerForgotPasswordPage from './components/lawyer/LawyerForgotPasswordPage';
import LawyerResetPasswordPage from './components/lawyer/LawyerResetPasswordPage';
import LawyerForgotPasswordEmailPage from './components/lawyer/LawyerForgotPasswordEmailPage';
import StartPage from './components/StartPage';
import UserProfilePage from './components/userside/UserProfilePage';
import UserProfileForm from './components/userside/UserProfileForm';
import LawyerProfilePage from './pages/lawyersidePages/LawyerProfilePage';
import LawyerProfileAddPage from './pages/lawyersidePages/LawyerProfileAddPage';
import LawyerViewPage from './pages/usersidePages/LawyerViewPage';
import LawyerListingPage from './pages/usersidePages/LawyerListingPage';
import SpecializationPage from './pages/adminsidePages/SpecializationPage';
import AvailablityAddPage from './pages/lawyersidePages/AvailablityAddPage';
import AppointmentPage from './pages/lawyersidePages/AppointmentPage';
import SlotBookingPage from './pages/usersidePages/SlotBookingPage';
import UserAppointmentPage from './pages/usersidePages/UserAppointmentPage';
import SlotListPage from './pages/lawyersidePages/SlotListPage';
import AppointmentListingPage from './pages/adminsidePages/AppointmentListingPage';
import ReportedAccountsPage from './pages/adminsidePages/ReportedAccountPage';
import SubscriptionPlanManagement from './pages/adminsidePages/SubscriptionManagementPage';
import SubscriptionPlanPage from './pages/lawyersidePages/SubscriptionPlanPage';
import ProfilePage from './components/admin/ProfilePage';
import ChatViewPage from './pages/usersidePages/ChatViewPage';
import ChatPage from './pages/usersidePages/ChatePage';
import LawyerChatListPage from './pages/lawyersidePages/LawyerChatListPage';
import LawyerChatViewPage from './pages/lawyersidePages/LawyerChatViewPage';
import AddBankDetailsPage from './pages/lawyersidePages/AddBankDetailsPage';
import AddFeedbackPage from './pages/usersidePages/AddFeedbackPage';
import ReviewListing from './components/reusableComponents/ReviewListing';
import CompanyReportPage from './pages/adminsidePages/CompanyReportPage';
import UserVideoCallPage from './pages/usersidePages/UserVideoCallPage';
import LawyerVideoCallPage from './pages/lawyersidePages/LawyerVideoCallPage';
import ConsultationHistoryPage from './components/reusableComponents/ConsultationHistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Main Website Routes */}

          <Route path='/' element={<StartPage />} />
          <Route path="/user" element={<HomePage />} />

          {/* Authentication Routes */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/otp-verification" element={<OTPVerification />} />
          <Route path='/auth/new-password' element={<NewPasswordPage />} />
          <Route path='/unAuthorized' element={<UnAuthorizedPage />} />
          <Route path='/googleFail' element={<GoogleFail />} />
          <Route path='/emailExist' element={<EmailExistError />} />
          <Route path='/block-page' element={<AccountBlockPage />} />


          <Route path="/auth/lawyer/signup" element={<SignupForm />} />
          <Route path="/auth/lawyer/signin" element={<LawyerSignin />} />
          <Route path='/auth/lawyer/forgotpassword' element={<LawyerForgotPasswordPage />} />
          <Route path='/auth/lawyer/forgot-password-email-page' element={<LawyerForgotPasswordEmailPage />} />

          <Route path='/lawyer' element={<LawyerWelcomePage />} />
          <Route path='/lawyer-verification-status' element={<LawyerVerificationStatusPage />} />

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user-dashboard" element={<Dashboard />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path='/user/profile' element={<UserProfilePage />} />
            <Route path='/user/add-profile' element={<UserProfileForm />} />
            <Route path='/user/lawyers' element={<LawyerListingPage />} />
            <Route path='/user/lawyer-view-page/:lawyerId' element={<LawyerViewPage />} />
            <Route path='/user/slot-booking/:lawyerId' element={<SlotBookingPage />} />
            <Route path='/user/appointments' element={<UserAppointmentPage />} />
            <Route path='/user/chat-view-page/:lawyerId' element={<ChatViewPage />} />
            <Route path='/user/chat' element={<ChatPage />} />
            <Route path='/feedback/:lawyerId' element={<AddFeedbackPage />} />
            <Route path='/reviews/:lawyerId' element={<ReviewListing />} />
            <Route path='/user/video-call/:appointmentId' element={<UserVideoCallPage />} />
            <Route path='/user/continue-slot-booking/:lawyerId/:caseId' element={<SlotBookingPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['lawyer']} />}>
            <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
            <Route path='/lawyer/reset-password' element={<LawyerResetPasswordPage />} />
            <Route path='/lawyer-profile-page' element={<LawyerProfilePage />} />
            <Route path='/lawyer/add-profile' element={<LawyerProfileAddPage />} />
            <Route path='/lawyer/add-availablity' element={<AvailablityAddPage />} />
            <Route path='/lawyer/appointments' element={<AppointmentPage />} />
            <Route path='/lawyer/slot-list-page' element={<SlotListPage />} />
            <Route path='/lawyer/subscription-plans' element={<SubscriptionPlanPage />} />
            <Route path='/lawyer/chat-list' element={<LawyerChatListPage />} />
            <Route path='/lawyer/chat-view/:userId' element={<LawyerChatViewPage />} />
            <Route path='/lawyer/add-bank-details' element={<AddBankDetailsPage />} />
            <Route path='/lawyer/reviews/:lawyerId/:userType' element={<ReviewListing />} />
            <Route path='/lawyer/video-call/:appointmentId' element={<LawyerVideoCallPage />} />
            <Route path='/lawyer/consultation-history/:caseId' element={<ConsultationHistoryPage/>}/>
          </Route>

          <Route path='/admin' element={<AdminWelcomePage />} />
          <Route path="/auth/admin/signin" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<Layout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="lawyer-verification" element={<LawyerVerification />} />
              <Route path="lawyers" element={<LawyerListing />} />
              <Route path="users" element={<UserListing />} />
              <Route path='specialization' element={<SpecializationPage />} />
              <Route path='admin/appointments' element={<AppointmentListingPage />} />
              <Route path='reported-accounts' element={<ReportedAccountsPage />} />
              <Route path='admin/subscription-plans' element={<SubscriptionPlanManagement />} />
              <Route path='profile-view' element={<ProfilePage />} />
              <Route path='company-report' element={<CompanyReportPage />} />
            </Route>
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