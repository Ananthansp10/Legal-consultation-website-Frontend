import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  MapPin,
  Camera,
  Save,
  X
} from 'lucide-react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { addProfile } from '../../services/user/profileService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  proffession: string;
  company: string;
  profileImage: File | null;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}


const UserProfileForm: React.FC = () => {
  const user=useSelector((state:any)=>state.auth.user)
  
  const [formData, setFormData] = useState<FormData>({
    fullName: user.name,
    email: user.email,
    phone: '',
    dateOfBirth: '',
    gender: '',
    proffession: '',
    company: '',
    profileImage: null,
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });


  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate=useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData()

    data.append('userId',user.id)
    data.append('name', formData.fullName)
    data.append('email', formData.email)
    data.append('phoneNumber', formData.phone)
    data.append('gender', formData.gender)
    data.append('DOB', formData.dateOfBirth)
    data.append('proffession', formData.proffession)
    data.append('company', formData.company)

    if (formData.profileImage instanceof File) {
      data.append('profileImage', formData.profileImage)
    }

    data.append('street', formData.streetAddress)
    data.append('city', formData.city)
    data.append('state', formData.state)
    data.append('country', formData.country)
    data.append('zipCode', formData.zipCode)

    addProfile(data).then((response)=>{
      toast.success(response.data.message)
      navigate('/user/profile')
    })

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel? All changes will be lost.');
    if (confirmCancel) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        proffession: '',
        company: '',
        profileImage: null,
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      });
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <Navbar/>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Add Profile</h1>
            <p className="text-[#64748b] text-lg">
              Enter your personal, contact, and professional information to complete your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#334155] mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                      placeholder="your.email@example.com"
                      required
                      readOnly
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    required
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Profession */}
                <div>
                  <label htmlFor="proffession" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Proffession
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="text"
                      id="profession"
                      name="proffession"
                      value={formData.proffession}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                      placeholder="Software Engineer"
                      required
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Working Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 w-4 h-4 text-[#94a3b8]" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                      placeholder="Company Name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="mt-6">
                <label className="text-sm text-[#64748b] font-medium mb-1 block">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profileImage"
                      className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-[#e2e8f0] rounded-lg cursor-pointer hover:border-[#3b82f6] transition-colors duration-200"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-[#94a3b8]" />
                      )}
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748b]">
                      Click to upload your profile picture
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#e2e8f0] my-6"></div>

            {/* Address Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#334155] mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="streetAddress" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="text-sm text-[#64748b] font-medium mb-1 block">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="New York"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="text-sm text-[#64748b] font-medium mb-1 block">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="NY"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="United States"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="text-sm text-[#64748b] font-medium mb-1 block">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-all duration-200"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[#64748b] hover:text-[#334155] font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3b82f6] text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 hover:shadow-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

            {/* Privacy Note */}
            <div className="text-center pt-4 border-t border-[#e2e8f0]">
              <p className="text-sm text-[#64748b]">
                🔒 Your details will be securely stored and never shared.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
