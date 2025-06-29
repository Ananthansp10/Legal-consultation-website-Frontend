import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Button from '../../components/admin/Button';
import Footer from '../../components/admin/Footer';
import { z } from 'zod';
import { signin } from '../../services/admin/authService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../../redux/slices/adminAuthSlice';
import { useSelector } from 'react-redux';

const Login: React.FC = () => {

  const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

  type LoginFormData = z.infer<typeof loginSchema>;
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const adminExist=useSelector((state:any)=>state.adminAuth.isAuthenticate)

  const dispatch=useDispatch()

  useEffect(()=>{
    if(adminExist){
      navigate('/admin-dashboard')
    }
  },[])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
    }else{
      signin(formData).then((response)=>{
        dispatch(adminLogin(response.data.data))
        toast.success(response.data.message)
        navigate('/admin-dashboard')
      }).catch((error)=>{
        toast.error(error.response.data.message)
      })
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-20 h-20 border border-white rounded-full"></div>
          </div>
          
          <div className="text-center text-white z-10 max-w-md px-6">
            <div className="flex items-center justify-center mb-8">
              <Scale className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">LegalConnect Admin</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Manage, Verify & Oversee with Confidence
            </p>
            <div className="mt-8 space-y-4">
              <div className="w-full h-px bg-white/20"></div>
              <p className="text-blue-200 text-sm">
                Empowering legal professionals through seamless administration
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
                <p className="text-slate-600 mt-2">Welcome back! Please sign in to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="admin@legalconnect.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter your password"
                    />
                     {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  Secure admin access for LegalConnect platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;