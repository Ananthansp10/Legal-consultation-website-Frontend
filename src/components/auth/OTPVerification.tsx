import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { otpService, resendOtp } from '../../services/user/otpService';
import { toast } from 'react-toastify'
import { User } from '../../interface/userInterface/userInterface';
import { useApi } from '../../hooks/UseApi';

const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: otpData, error: otpApiError, loading: otpLoading, execute: otpExecute } = useApi(otpService)
  const { data: resendData, error: resendError, loading: resendLoading, execute: resendExecute } = useApi(resendOtp)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const validateOtp = (otpArray: string[]) => {
    const otpValue = otpArray.join('');
    
    if (otpValue.length === 0) {
      setOtpError('OTP is required');
      return false;
    }
    
    if (otpValue.length < 6) {
      setOtpError('Please enter complete 6-digit OTP');
      return false;
    }
    
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError('OTP must contain only numbers');
      return false;
    }
    
    setOtpError('');
    return true;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Clear error when user starts typing
      if (otpError) {
        setOtpError('');
      }

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Validate on every change
      validateOtp(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      
      // Clear error when user starts correcting
      if (otpError) {
        setOtpError('');
      }
    }
  };

  const handleBlur = () => {
    validateOtp(otp);
  };

  let userDetails = localStorage.getItem('userDetails')
  let userData: User | undefined=userDetails ? JSON.parse(userDetails) : ''

  // Check if form is valid for button activation
  useEffect(() => {
    const otpValue = otp.join('');
    const isValid = otpValue.length === 6 && /^\d{6}$/.test(otpValue) && !otpError;
    setIsFormValid(isValid);
  }, [otp, otpError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isOtpValid = validateOtp(otp);
    
    if (!isOtpValid) {
      return;
    }

    const otpValue = otp.join('');

    await otpExecute({ userDetails: userData!, otp: otpValue })
  };

  useEffect(() => {
    if (otpApiError) {
      toast.error(otpApiError.message)
    }
  }, [otpApiError])

  useEffect(() => {
    if (otpData) {
      if (userData?.forgotPassword) {
        navigate('/auth/new-password')
      } else {
        localStorage.removeItem('userDetails')
        toast.success(otpData.message)
        setTimeout(() => {
          navigate('/auth/signin')
        }, 2000)
      }
    }
  }, [otpData])

  const handleResend = async () => {
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    
    // Set new expiration time for 120 seconds
    const expirationTime = Date.now() + (120 * 1000);
    localStorage.setItem('otpTimerExpiration', expirationTime.toString());
    setTimer(120);
    
    let userDetails: string | null = localStorage.getItem('userDetails')
    if (userDetails) {
      await resendExecute(JSON.parse(userDetails))
    }
  };

  useEffect(() => {
    if (resendError) {
      toast.error(resendError.message)
    }
  }, [resendError])

  useEffect(() => {
    if (resendData) {
      toast.success(resendData.message)
      // Timer is already set in handleResend, no need to set it here
    }
  }, [resendData])

  return (
    <div className="min-h-screen flex">
      {/* Back to Home Button */}
      <Link
        to="/user"
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-slate-600 hover:text-blue-500 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Legal consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Verify Your Identity</h2>
            <p className="text-xl opacity-90">Enter the verification code to secure your account</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Enter Verification Code</h1>
              <p className="text-slate-600">
                We've sent a 6-digit verification code to your registered email or phone number.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onBlur={handleBlur}
                      className={`w-12 h-12 text-center text-xl font-bold bg-white/80 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        otpError 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-200 focus:ring-blue-500'
                      }`}
                      maxLength={1}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm mt-3 text-center">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={otpLoading || !isFormValid}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isFormValid && !otpLoading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <div className="text-slate-600">
                Didn't receive the code?
              </div>

              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className={`inline-flex items-center space-x-2 font-medium transition-colors duration-200 ${
                    resendLoading 
                      ? 'text-slate-400 cursor-not-allowed' 
                      : 'text-blue-500 hover:text-blue-600'
                  }`}
                >
                  {resendLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span>Resending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-slate-500">
                  Resend code in {timer}s
                </div>
              )}

              <div>
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;