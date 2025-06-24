import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Scale, ArrowRight } from 'lucide-react';

function LawyerSignin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Here you would typically handle the actual authentication
    console.log('Sign in attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Legal Background */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
            }}
          ></div>
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-blue-900/90"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            <div className="mb-8">
              <Scale className="w-12 h-12 text-blue-400 mb-6" />
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Justice Through
                <br />
                <span className="text-blue-400">Legal Excellence</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                "The good lawyer is not the man who has an eye to every side and angle of contingency, but who throws himself on your part so heartily, that he can get you out of a scrape."
              </p>
              <p className="text-blue-300 font-medium">— Ralph Waldo Emerson</p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Secure client portal access</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Case management dashboard</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Document collaboration tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <Scale className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900">Legal Portal</h1>
            </div>

            {/* Glassmorphism card */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Sign In to Your Account
                </h2>
                <p className="text-slate-600">
                  Access your legal dashboard securely
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-900 transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-900 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <div className="text-center mt-6 pt-6 border-t border-white/20">
                <p className="text-slate-600">
                  Don't have an account?{' '}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up here
                  </a>
                </p>
              </div>
            </div>

            {/* Security notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Protected by industry-standard encryption and security protocols
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LawyerSignin;