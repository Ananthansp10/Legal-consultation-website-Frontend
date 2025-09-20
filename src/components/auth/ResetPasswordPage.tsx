import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Shield, CheckCircle, Check, X } from 'lucide-react';
import { resetPassword } from '../../services/user/authService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { ApiResponse } from '../../interface/userInterface/axiosResponseInterface';
import { AxiosResponse } from 'axios';

function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Password validation criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecialChar: false
  });


  let email: string | undefined = useSelector((state: RootState) => state.auth?.user?.email)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validatePasswordCriteria = (password: string) => {
    const criteria = {
      minLength: password.length >= 6,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));

    // Validate password criteria for new password
    if (field === 'newPassword') {
      validatePasswordCriteria(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!passwords.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePasswordCriteria(passwords.newPassword)) {
      newErrors.newPassword = 'Password must meet all requirements';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Check if form is valid for button activation
  useEffect(() => {
    const isValid =
      passwords.oldPassword.length > 0 &&
      passwords.newPassword.length > 0 &&
      passwords.confirmPassword.length > 0 &&
      Object.values(passwordCriteria).every(Boolean) &&
      passwords.newPassword === passwords.confirmPassword;

    setIsFormValid(isValid);
  }, [passwords, passwordCriteria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    interface ResetPasswordResponse {
      success: boolean;
      message: string;
    }

    resetPassword({ email: email!, oldPassword: passwords.oldPassword, newPassword: passwords.newPassword }).then((response: AxiosResponse<ApiResponse<ResetPasswordResponse>>) => {
      if (response?.data?.success) {
        setIsSubmitting(false)
        dispatch(logout())
        toast.success(response.data.message)
        navigate('/auth/signin')
      }
    }).catch((error) => {
      toast.error(error.response.data.message)
      setIsSubmitting(false)
    })
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-xl animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Password Updated!</h2>
          <p className="text-slate-600">Your password has been successfully updated. You can now use your new password to sign in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex min-h-screen">
        {/* Left Side - Legal Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-slate-900/10 z-10"></div>
          <img
            src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Legal justice scales and gavel"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h3 className="text-2xl font-bold mb-2">Secure & Professional</h3>
            <p className="text-lg opacity-90">Your security is our top priority</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Image */}
            <div className="lg:hidden mb-8 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-slate-900/10 z-10"></div>
              <img
                src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Legal justice scales"
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Glassmorphism Form Container */}
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl animate-slide-up">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-700 text-center mb-2">Reset Password</h1>
              <p className="text-slate-600 text-center mb-8">Please enter your current password and choose a new one</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Old Password */}
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-600 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="oldPassword"
                      type={showPasswords.oldPassword ? 'text' : 'password'}
                      value={passwords.oldPassword}
                      onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPasswords.oldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="newPassword"
                      type={showPasswords.newPassword ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPasswords.newPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}

                  {/* Password Requirements */}
                  {passwords.newPassword && (
                    <div className="mt-3 p-3 bg-slate-50/50 rounded-lg border border-slate-200/50">
                      <p className="text-xs font-medium text-slate-600 mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {passwordCriteria.minLength ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${passwordCriteria.minLength ? 'text-green-600' : 'text-slate-500'}`}>
                            At least 6 characters
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {passwordCriteria.hasLowercase ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${passwordCriteria.hasLowercase ? 'text-green-600' : 'text-slate-500'}`}>
                            One lowercase letter
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {passwordCriteria.hasUppercase ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${passwordCriteria.hasUppercase ? 'text-green-600' : 'text-slate-500'}`}>
                            One uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {passwordCriteria.hasSpecialChar ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${passwordCriteria.hasSpecialChar ? 'text-green-600' : 'text-slate-500'}`}>
                            One special character
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPasswords.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}

                  {/* Password Match Indicator */}
                  {passwords.confirmPassword && passwords.newPassword && (
                    <div className="mt-2 flex items-center space-x-2">
                      {passwords.newPassword === passwords.confirmPassword ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform flex items-center justify-center space-x-2 ${isFormValid && !isSubmitting
                      ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.02] cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50/50 border border-blue-200/50 rounded-xl">
                <p className="text-sm text-slate-600 text-center">
                  Your password will be encrypted and stored securely. Make sure to choose a strong password that meets all requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;