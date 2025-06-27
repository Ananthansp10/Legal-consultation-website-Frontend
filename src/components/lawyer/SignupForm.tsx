import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, CheckCircle, Scale, Gavel, BookOpen, User, Mail, Lock, GraduationCap, FileText, Camera } from 'lucide-react';
import { register } from '../../services/lawyer/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  experience: string;
  specialization: string[];
  barCouncilNumber: string;
  lawDegree: File | null;
  barCertificate: File | null;
}

const specializations = [
  'Criminal Law',
  'Corporate Law',
  'Family Law',
  'Immigration Law',
  'Real Estate Law',
  'Intellectual Property',
  'Tax Law',
  'Labor Law',
  'Environmental Law',
  'Constitutional Law'
];

const experienceOptions = [
  '0-2 years',
  '3-5 years',
  '6-10 years',
  '11-15 years',
  '16-20 years',
  '20+ years'
];

function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    experience: '',
    specialization: [],
    barCouncilNumber: '',
    lawDegree: null,
    barCertificate: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState<string | null>(null);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const navigate=useNavigate()

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
        newErrors.fullName = 'Full name must contain only alphabets';
      }
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else if (step === 2) {
      if (!formData.experience) newErrors.experience = 'Experience is required';
      if (formData.specialization.length === 0) newErrors.specialization = 'At least one specialization is required';
      if (!formData.barCouncilNumber.trim()) newErrors.barCouncilNumber = 'Bar Council Number is required';
    } else if (step === 3) {
      if (!formData.lawDegree) newErrors.lawDegree = 'Law degree certificate is required';
      if (!formData.barCertificate) newErrors.barCertificate = 'Bar council certificate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      const data = new FormData();

      data.append('name', formData.fullName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('experience', formData.experience);
      data.append('barCouncilNumber', formData.barCouncilNumber);

      formData.specialization.forEach((spec) => {
        data.append('specialization[]', spec);
      });

      if (formData.lawDegree) data.append('files', formData.lawDegree);
      if (formData.barCertificate) data.append('files', formData.barCertificate);

        register(data).then((response:any)=>{
          toast.success(response.data.message)
          navigate('/auth/lawyer/signin')
        }).catch((error)=>{
          toast.error(error.response.data.message)
        })
      }
  };

  const handleDrag = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'lawDegree' | 'barCertificate') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      updateFormData(type, e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'lawDegree' | 'barCertificate') => {
    if (e.target.files && e.target.files[0]) {
      updateFormData(type, e.target.files[0]);
    }
  };

  const toggleSpecialization = (spec: string) => {
    const current = formData.specialization;
    if (current.includes(spec)) {
      updateFormData('specialization', current.filter(s => s !== spec));
    } else {
      updateFormData('specialization', [...current, spec]);
    }
  };

  const FileUploadArea = ({ type, file, label }: { type: 'lawDegree' | 'barCertificate', file: File | null, label: string }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive === type
            ? 'border-blue-400 bg-blue-400/10'
            : file
            ? 'border-green-400 bg-green-400/10'
            : 'border-white/30 hover:border-white/50'
        }`}
        onDragEnter={(e) => handleDrag(e, type)}
        onDragLeave={(e) => handleDrag(e, type)}
        onDragOver={(e) => handleDrag(e, type)}
        onDrop={(e) => handleDrop(e, type)}
      >
        <input
          type="file"
          id={type}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileInput(e, type)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          {file ? (
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => updateFormData(type, null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
              <p className="text-white/90 font-medium">Drop your file here</p>
              <p className="text-white/60 text-sm">or click to browse</p>
              <p className="text-white/40 text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          )}
        </div>
      </div>
      {errors[type] && <p className="text-red-400 text-sm">{errors[type]}</p>}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-white/80 mb-6">
            Thank you for your application. We'll review your credentials and get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                experience: '',
                specialization: [],
                barCouncilNumber: '',
                lawDegree: null,
                barCertificate: null
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/40"></div>
        <img
          src="https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Legal courthouse"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LegalAccess Pro</h1>
                <p className="text-blue-200 text-sm">Professional Legal Platform</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <blockquote className="text-xl font-light italic border-l-4 border-blue-400 pl-6">
              "Justice delayed is justice denied."
            </blockquote>
            <p className="text-lg font-medium">Secure legal access for professionals</p>
            <div className="flex items-center space-x-8 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Gavel className="h-4 w-4" />
                <span>Verified Lawyers</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Legal Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>Account</span>
              <span>Professional</span>
              <span>Documents</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
                  <p className="text-white/70">Join our professional legal network</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Create a password"
                      />
                    </div>
                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Your Legal Details</h2>
                  <p className="text-white/70">Tell us about your professional background</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Years of Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', e.target.value)}
                      className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-800">Select experience level</option>
                      {experienceOptions.map((exp) => (
                        <option key={exp} value={exp} className="bg-slate-800">{exp}</option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Areas of Specialization</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {specializations.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialization(spec)}
                          className={`text-left py-2 px-3 rounded-lg text-sm transition-all ${
                            formData.specialization.includes(spec)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                    {errors.specialization && <p className="text-red-400 text-sm mt-1">{errors.specialization}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Bar Council Number</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="text"
                        value={formData.barCouncilNumber}
                        onChange={(e) => updateFormData('barCouncilNumber', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your bar council number"
                      />
                    </div>
                    {errors.barCouncilNumber && <p className="text-red-400 text-sm mt-1">{errors.barCouncilNumber}</p>}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Certificates</h2>
                  <p className="text-white/70">Verify your credentials with official documents</p>
                </div>

                <div className="space-y-6">
                  <FileUploadArea 
                    type="lawDegree" 
                    file={formData.lawDegree} 
                    label="Law Degree Certificate" 
                  />
                  
                  <FileUploadArea 
                    type="barCertificate" 
                    file={formData.barCertificate} 
                    label="Bar Council Certificate" 
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <span>Submit Application</span>
                    <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <Scale className="h-5 w-5" />
              <span className="text-sm">LegalAccess Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;