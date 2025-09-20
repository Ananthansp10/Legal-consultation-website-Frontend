import { User, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StartPage() {

  const navigate = useNavigate()
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with blur and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/90 backdrop-blur-sm"></div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Glassmorphic card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-amber-500/20">
            {/* Logo/Brand area */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-6 shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>

              {/* Welcome headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  LegalConnect
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-white/80 font-light">
                Who are you?
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              {/* I am a User button */}
              <button onClick={() => navigate('/user')} className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-blue-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                <div className="flex items-center justify-center space-x-3">
                  <User className="w-6 h-6 transition-transform group-hover:scale-110" />
                  <span className="text-lg">I am a User</span>
                </div>
              </button>

              {/* I am a Lawyer button */}
              <button onClick={() => navigate('/lawyer')} className="group w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-amber-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10">
                <div className="flex items-center justify-center space-x-3">
                  <Scale className="w-6 h-6 transition-transform group-hover:scale-110" />
                  <span className="text-lg">I am a Lawyer</span>
                </div>
              </button>
            </div>

            {/* Additional info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-white/60">
                Choose your role to get started with professional legal services
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              Connecting clients with qualified legal professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;