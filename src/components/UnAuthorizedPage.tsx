import { ShieldX, ArrowLeft, Lock, AlertTriangle,LogIn } from 'lucide-react';
import {useNavigate, useSearchParams } from 'react-router-dom';

function UnAuthorizedPage() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role')
    let navigate=useNavigate()

    function gotoLogin(){
        if(role==='user'){
            navigate('/auth/signin')
        }else if(role==='lawyer'){
          navigate('/auth/lawyer/signin')
        }else{
          navigate('/auth/admin/signin')
        }
    }

    function goBack(){

      if(role==='user'){
            navigate('/')
        }else if(role==='lawyer'){
          navigate('/lawyer')
        }else{
          navigate('/admin')
        }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <ShieldX className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                <p className="text-red-100 font-medium">Error 401 - Unauthorized</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12">
            {/* Icon and Status */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6 border-4 border-red-100 shadow-lg">
                <Lock className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                You don't have permission to access this page
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                This area is restricted to authorized users only. Please check your credentials or contact your administrator.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Security Notice
                  </h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    Unauthorized access attempts are logged and monitored. If you believe this is an error, please contact support with your user ID and the time of access.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={goBack} className="group inline-flex items-center justify-center px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Go Back
              </button>
              <button onClick={gotoLogin} className="group inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl shadow-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <LogIn className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Return Login
              </button>
            </div>

            {/* Additional Help */}
            <div className="text-center mt-8 pt-8 border-t border-slate-100">
              <p className="text-slate-500 text-sm mb-2">Need help?</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-2 hover:underline-offset-4 transition-all duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            If you believe this is an error, please try refreshing the page or contact your system administrator.
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default UnAuthorizedPage;