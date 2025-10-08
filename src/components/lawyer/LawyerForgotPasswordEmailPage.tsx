import React, { useState } from "react";
import { Mail, Scale, ArrowRight, CheckCircle2 } from "lucide-react";
import { sendMail } from "../../services/lawyer/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LawyerForgotPasswordEmailPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    sendMail({ email: email })
      .then((response) => {
        toast.success(response.data.message);
        setEmail("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setEmail("");
      });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Legal Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background with legal imagery */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Legal background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <div className="animate-fade-in-up delay-300">
            <div className="mb-8 p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Scale className="w-16 h-16 text-blue-300" />
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Secure Legal Practice
              <br />
              <span className="text-blue-300">Management</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-md leading-relaxed">
              Professional tools designed for modern legal practitioners,
              ensuring security and confidentiality at every step.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <div className="animate-fade-in-up">
              {/* Glassmorphism Form Container */}
              <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl shadow-slate-200/20 p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-700 mb-3">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/70 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValidEmail(email) || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-slate-600">
                    Remember your password?{" "}
                    <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="animate-fade-in-up">
              <div className="bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl shadow-slate-200/20 p-8 lg:p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-700 mb-3">
                  Check Your Email
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>
                </p>
                <p className="text-sm text-slate-500 mb-8">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    try again
                  </button>
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    navigate("/auth/lawyer/signin");
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Legal Theme Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-center p-4">
          <Scale className="w-6 h-6 text-blue-400 mr-2" />
          <span className="text-white font-semibold">
            Legal Practice Portal
          </span>
        </div>
      </div>
    </div>
  );
}

export default LawyerForgotPasswordEmailPage;
