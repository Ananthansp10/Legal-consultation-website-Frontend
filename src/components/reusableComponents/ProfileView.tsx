import React from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Award, Calendar, Users, GraduationCap, DollarSign, FileImage, CreditCard } from 'lucide-react';

// Type definitions
interface BaseProfile {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImage: string;
}

interface UserProfile extends BaseProfile {
  type: 'user';
}

interface LawyerProfile extends BaseProfile {
  type: 'lawyer';
  barNumber: string;
  specialization: string;
  experience: string;
  totalConsultations: number;
  education: string;
  consultationFee: string;
  certificates: {
    barCouncilCertificate: string;
    experienceCertificate: string;
    degreeCertificate: string;
    aadharNumber: string;
  };
}

type Profile = UserProfile | LawyerProfile;

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  // Detail items configuration
  const getDetailItems = () => {
    const baseItems = [
      { icon: Mail, label: 'Email', value: profile.email },
      { icon: Phone, label: 'Phone', value: profile.phoneNumber },
      { icon: MapPin, label: 'Address', value: profile.address },
    ];

    if (profile.type === 'lawyer') {
      return [
        ...baseItems,
        { icon: Award, label: 'Bar Number', value: profile.barNumber },
        { icon: Briefcase, label: 'Specialization', value: profile.specialization },
        { icon: Calendar, label: 'Experience', value: profile.experience },
        { icon: Users, label: 'Total Consultations', value: profile.totalConsultations.toString() },
        { icon: GraduationCap, label: 'Education', value: profile.education },
        { icon: DollarSign, label: 'Consultation Fee', value: profile.consultationFee },
      ];
    }

    return baseItems;
  };

  const detailItems = getDetailItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-8 md:p-12">
          {/* Profile Header */}
          <div className="text-center mb-10">
            {/* Profile Image */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-300 hover:scale-105">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status indicator for lawyer */}
              {profile.type === 'lawyer' && (
                <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-2 border-4 border-white shadow-md">
                  <Briefcase size={16} />
                </div>
              )}
              {/* Status indicator for user */}
              {profile.type === 'user' && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-2 border-4 border-white shadow-md">
                  <User size={16} />
                </div>
              )}
            </div>

            {/* Name and Role */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {profile.name}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                profile.type === 'lawyer' 
                  ? 'bg-teal-100 text-teal-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {profile.type === 'lawyer' ? <Briefcase size={16} /> : <User size={16} />}
                {profile.type === 'lawyer' ? 'Legal Professional' : 'Client'}
              </div>
            </div>
            <p className="text-lg text-gray-600">{profile.email}</p>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className={`text-2xl font-semibold mb-8 ${
                profile.type === 'lawyer' ? 'text-teal-600' : 'text-blue-600'
              }`}>
                Profile Details
              </h2>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detailItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 min-w-0"
                >
                  <div className="flex flex-col space-y-3">
                    <div className={`p-3 rounded-xl ${
                      profile.type === 'lawyer' 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-blue-100 text-blue-600'
                    } w-fit`}>
                      <item.icon size={24} />
                    </div>
                    <div className="w-full">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {item.label}
                      </h3>
                      <p className="text-lg font-semibold text-gray-900 break-words leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certificates Section for Lawyers */}
            {profile.type === 'lawyer' && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-teal-600 mb-6 text-center">
                  Certificates & Documents
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Council Certificate */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                        <FileImage size={20} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
                        Bar Council Certificate
                      </h4>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200 w-full">
                      <img
                        src={profile.certificates.barCouncilCertificate}
                        alt="Bar Council Certificate"
                        className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Experience Certificate */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <FileImage size={20} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
                        Experience Certificate
                      </h4>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200 w-full">
                      <img
                        src={profile.certificates.experienceCertificate}
                        alt="Experience Certificate"
                        className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Degree Certificate */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                        <FileImage size={20} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
                        Degree Certificate
                      </h4>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200 w-full">
                      <img
                        src={profile.certificates.degreeCertificate}
                        alt="Degree Certificate"
                        className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Aadhar Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <CreditCard size={20} />
                      </div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
                        Aadhar Card
                      </h4>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200 w-full">
                      <img
                        src={profile.certificates.aadharNumber}
                        alt="Aadhar Card"
                        className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Professional Summary for Lawyers */}
          {profile.type === 'lawyer' && (
            <div className="mt-10">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-200/30">
                <h3 className="text-xl font-semibold text-teal-700 mb-4 text-center">
                  Professional Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/60 rounded-xl p-4">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600 break-words">{profile.experience}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Experience</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{profile.totalConsultations}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Consultations</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <div className="text-lg sm:text-xl font-bold text-purple-600 break-words leading-tight">{profile.specialization}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Specialization</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4">
                    <div className="text-lg sm:text-xl font-bold text-green-600 break-words leading-tight">{profile.consultationFee}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Consultation Fee</div>
                  </div>
                </div>
                <div className="mt-6 bg-white/60 rounded-xl p-4 text-center">
                  <div className="text-base sm:text-lg font-semibold text-indigo-600 break-words leading-relaxed">{profile.education}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-2">Educational Background</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;