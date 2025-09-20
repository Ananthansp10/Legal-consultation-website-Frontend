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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: otpData, error: otpError, loading: otpLoading, execute: otpExecute } = useApi(otpService)
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

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    let userDetails = localStorage.getItem('userDetails')
    let userData: User | undefined
    if (userDetails) {
      userData = JSON.parse(userDetails)
    }
    // otpService({userDetails:userData!,otp:otpValue}).then((response)=>{
    //   if(userData?.forgotPassword){
    //    navigate('/auth/new-password')
    //   }else{
    //     localStorage.removeItem('userDetails')
    //     toast.success(response.data.message)
    //     setTimeout(() => {
    //     navigate('/auth/signin')
    //   }, 2000);
    //   }
    // }).catch((error)=>{
    //     toast.error(error.message)
    // })

    await otpExecute({ userDetails: userData!, otp: otpValue })
  };

  useEffect(() => {
    if (otpError) {
      toast.error(otpError.message)
    }
  }, [otpError])

  useEffect(() => {
    if (otpData) {
      if (otpData.forgotPassword) {
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
    let userDetails: string | null = localStorage.getItem('userDetails')
    if (userDetails) {
      //    resendOtp(JSON.parse(userDetails)).then((response)=>{
      //   if(response.data.success){
      //     toast.success(response.data.message)
      //     setTimer(120);
      //   }
      // }).catch((error)=>{
      //   toast.error(error.response.data.message)
      // })

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
      setTimer(120)
    }
  }, [resendData])

  return (
    <div className="min-h-screen flex">
      {/* Back to Home Button */}
      <Link
        to="/"
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
                      className="w-12 h-12 text-center text-xl font-bold bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Verify OTP
              </button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <div className="text-slate-600">
                Didn't receive the code?
              </div>

              {canResend ? (
                <button
                  onClick={handleResend}
                  className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend Code</span>
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