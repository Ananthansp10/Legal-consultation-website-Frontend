import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { saveNewPassword } from '../../services/lawyer/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';


const forgotPasswordSchema = z
  .object({
    newPassword: z.string().trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (!data.newPassword) {
      ctx.addIssue({
        path: ['newPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Password is required',
      });
    } else if (data.newPassword.length < 6) {
      ctx.addIssue({
        path: ['newPassword'],
        code: z.ZodIssueCode.too_small,
        minimum: 6,
        type: 'string',
        inclusive: true,
        message: 'Password must be at least 6 characters',
      });
    }

    if (!data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Confirm Password is required',
      });
    } else if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
      });
    }
  });


const LawyerForgotPasswordPage: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token=searchParams.get('token')
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = forgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;
      setFormErrors({
        newPassword: flattened.newPassword?.[0] || '',
        confirmPassword: flattened.confirmPassword?.[0] || ''
      });
      return;
    }

    setFormErrors({});

    saveNewPassword({ email: email!, password: formData.newPassword,token:token! })
      .then((response) => {
        toast.success(response.data.message);
        navigate('/auth/lawyer/signin');
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Something went wrong');
        if(error.response.data.message=="Link has Expired try again"){
          navigate('/auth/lawyer/forgot-password-email-page')
        }
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Legal Theme Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200')`
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Secure Access for Legal Professionals
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Your trusted platform for legal document management and client communications. Security and privacy are our top priorities.
              </p>
            </div>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>HIPAA compliant infrastructure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>24/7 secure access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Glassmorphism Form */}
      <div className="flex-1 lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-30 p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Forgot Password</h2>
              <p className="text-slate-500">Please enter your new password to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-600">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white bg-opacity-50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Remember your password?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerForgotPasswordPage;
