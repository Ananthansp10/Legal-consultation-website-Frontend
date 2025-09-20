import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { changePaasword } from '../../services/user/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/UseApi';

function NewPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data, error, loading, execute } = useApi(changePaasword)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let userDetails = localStorage.getItem('userDetails')
    let user
    if (userDetails) {
      user = JSON.parse(userDetails) as { email: string }
      // changePaasword({email:user.email,password:newPassword}).then((response)=>{
      //   if(response.data.success){
      //     setIsLoading(false);
      //     toast.success(response.data.message)
      //     localStorage.removeItem('userDetails')
      //     navigate('/auth/signin')
      //   }
      // }).catch((error)=>{
      //   setIsLoading(false);
      //   toast.error(error.response.data.message)
      //   navigate('/auth/forgot-password')
      // })

      await execute({ email: user.email, password: newPassword })
    }
  };

  useEffect(() => {
    if (error) {
      setIsLoading(false)
      toast.error(error.message)
      navigate('/auth/forgot-password')
    }
  }, [error])

  useEffect(() => {
    if (data) {
      setIsLoading(false)
      toast.success(data.message)
      localStorage.removeItem('userDetails')
      navigate('/auth/signin')
    }
  }, [data])

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  // Updated password validation requirements
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

  const isFormValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && passwordsMatch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Side - Legal Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/20 z-10"></div>
        <img
          src="https://sp.yimg.com/ib/th?id=OIP.uhO9XcT6WmkXRa7s_6C7swHaHa&pid=Api&w=148&h=148&c=7&dpr=2&rs=1"
          alt="Legal scales of justice"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <Shield className="w-16 h-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl font-bold mb-4">Secure Access</h2>
            <p className="text-lg text-white/80 max-w-md">
              Your security is our priority. Set a strong password to protect your legal documents and sensitive information.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile Legal Image */}
          <div className="lg:hidden mb-8 relative rounded-2xl overflow-hidden h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/20 z-10"></div>
            <img
              src="https://images.pexels.com/photos/5668774/pexels-photo-5668774.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Legal scales of justice"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Shield className="w-12 h-12 text-white/90" />
            </div>
          </div>

          {/* Glassmorphism Card */}
          <div className="bg-white/40 backdrop-blur-lg border border-slate-200 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-700 mb-2">Set New Password</h1>
              <p className="text-slate-500">Create a strong password to secure your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 6 && (
                  <p className="text-sm text-red-500">Password must be at least 6 characters long</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
                {passwordsMatch && confirmPassword.length > 0 && (
                  <p className="text-sm text-green-600">Passwords match!</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-50/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center text-sm ${hasMinLength ? 'text-green-600' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${hasMinLength ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    At least 6 characters long
                  </div>
                  <div className={`flex items-center text-sm ${hasUppercase ? 'text-green-600' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${hasUppercase ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Contains uppercase letter
                  </div>
                  <div className={`flex items-center text-sm ${hasLowercase ? 'text-green-600' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${hasLowercase ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Contains lowercase letter
                  </div>
                  <div className={`flex items-center text-sm ${hasNumber ? 'text-green-600' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${hasNumber ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Contains number
                  </div>
                  <div className={`flex items-center text-sm ${hasSpecialChar ? 'text-green-600' : 'text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${hasSpecialChar ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    Contains special character
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${isFormValid && !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Setting Password...
                  </div>
                ) : (
                  'Set New Password'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                By setting a new password, you agree to our security policies
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default NewPasswordPage;