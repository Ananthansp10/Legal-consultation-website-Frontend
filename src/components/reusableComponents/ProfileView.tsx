import React from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Award, Calendar, Users, GraduationCap, DollarSign, FileImage, CreditCard, Globe, Clock, Building, Scale } from 'lucide-react';
import Navbar from '../admin/Navbar';

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Education {
  degree: string;
  university: string;
  year: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phoneNumber: string;
  DOB: string;
  gender: string;
  address: Address;
  language: string[];
  profileImage: string;
}

interface ProfessionalInfo {
  practiceAreas: string[];
  barRegisterNumber: string;
  experience: string;
  courtName: string;
  workLocation: string;
  fee: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  education: Education;
  documents: string[];
}

interface UserProfileEntity {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  DOB: string;
  profession: string;
  company: string;
  profileImage: string;
  address: Address;
}

interface LawyerProfileEntity {
  _id?: string;
  lawyerId?: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
}

type Profile = UserProfileEntity | LawyerProfileEntity;

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  const isLawyer = 'personalInfo' in profile;
  const isUser = 'name' in profile && !('personalInfo' in profile);

  const getPersonalDetailItems = () => {
    if (isLawyer) {
      const lawyer = profile as LawyerProfileEntity;
      return [
        { icon: Mail, label: 'Email', value: lawyer.personalInfo.email },
        { icon: Phone, label: 'Phone', value: lawyer.personalInfo.phoneNumber },
        { icon: Calendar, label: 'Date of Birth', value: lawyer.personalInfo.DOB },
        { icon: User, label: 'Gender', value: lawyer.personalInfo.gender },
        { icon: MapPin, label: 'Address', value: `${lawyer.personalInfo.address.street}, ${lawyer.personalInfo.address.city}, ${lawyer.personalInfo.address.state}` },
        { icon: Globe, label: 'Languages', value: lawyer.personalInfo.language.join(', ') },
      ];
    } else if (isUser) {
      const user = profile as UserProfileEntity;
      return [
        { icon: Mail, label: 'Email', value: user.email },
        { icon: Phone, label: 'Phone', value: user.phoneNumber },
        { icon: Calendar, label: 'Date of Birth', value: user.DOB },
        { icon: User, label: 'Gender', value: user.gender },
        { icon: Briefcase, label: 'Profession', value: user.profession },
        { icon: Building, label: 'Company', value: user.company },
        { icon: MapPin, label: 'Address', value: `${user.address.street}, ${user.address.city}, ${user.address.state}` },
      ];
    }
    return [];
  };

  const getProfessionalDetailItems = () => {
    if (isLawyer) {
      const lawyer = profile as LawyerProfileEntity;
      return [
        { icon: Scale, label: 'Practice Areas', value: lawyer.professionalInfo.practiceAreas.join(', ') },
        { icon: Award, label: 'Bar Register Number', value: lawyer.professionalInfo.barRegisterNumber },
        { icon: Calendar, label: 'Experience', value: lawyer.professionalInfo.experience },
        { icon: Building, label: 'Court Name', value: lawyer.professionalInfo.courtName },
        { icon: MapPin, label: 'Work Location', value: lawyer.professionalInfo.workLocation },
        { icon: DollarSign, label: 'Consultation Fee', value: lawyer.professionalInfo.fee },
        { icon: Calendar, label: 'Available Days', value: lawyer.professionalInfo.availableDays.join(', ') },
        { icon: Clock, label: 'Working Hours', value: `${lawyer.professionalInfo.startTime} - ${lawyer.professionalInfo.endTime}` },
        { icon: GraduationCap, label: 'Education', value: `${lawyer.professionalInfo.education.degree} from ${lawyer.professionalInfo.education.university} (${lawyer.professionalInfo.education.year})` },
      ];
    }
    return [];
  };

  const personalDetailItems = getPersonalDetailItems();
  const professionalDetailItems = getProfessionalDetailItems();

  const getProfileName = () => {
    if (isLawyer) {
      return (profile as LawyerProfileEntity).personalInfo.name;
    } else if (isUser) {
      return (profile as UserProfileEntity).name;
    }
    return '';
  };

  const getProfileImage = () => {
    if (isLawyer) {
      return (profile as LawyerProfileEntity).personalInfo.profileImage;
    } else if (isUser) {
      return (profile as UserProfileEntity).profileImage;
    }
    return '';
  };

  const getProfileEmail = () => {
    if (isLawyer) {
      return (profile as LawyerProfileEntity).personalInfo.email;
    } else if (isUser) {
      return (profile as UserProfileEntity).email;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-8 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-12">
        {/* Main Profile Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/50 p-8 md:p-12">
          <div className="text-center mb-10">
            {/* Profile Image */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-300 hover:scale-105">
                <img
                  src={getProfileImage()}
                  alt={getProfileName()}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status indicator for lawyer */}
              {isLawyer && (
                <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-2 border-4 border-white shadow-md">
                  <Briefcase size={16} />
                </div>
              )}
              {/* Status indicator for user */}
              {isUser && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-2 border-4 border-white shadow-md">
                  <User size={16} />
                </div>
              )}
            </div>

            {/* Name and Role */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {getProfileName()}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isLawyer
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                {isLawyer ? <Briefcase size={16} /> : <User size={16} />}
                {isLawyer ? 'Legal Professional' : 'Client'}
              </div>
            </div>
            <p className="text-lg text-gray-600">{getProfileEmail()}</p>
          </div>

          {/* Personal Details Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className={`text-2xl font-semibold mb-8 ${isLawyer ? 'text-teal-600' : 'text-blue-600'
                }`}>
                Personal Details
              </h2>
            </div>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalDetailItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 min-w-0"
                >
                  <div className="flex flex-col space-y-3">
                    <div className={`p-3 rounded-xl ${isLawyer
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

            {/* Professional Details Section for Lawyers */}
            {isLawyer && (
              <>
                <div className="text-center mt-12">
                  <h2 className="text-2xl font-semibold mb-8 text-teal-600">
                    Professional Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {professionalDetailItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 min-w-0"
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="p-3 rounded-xl bg-teal-100 text-teal-600 w-fit">
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
              </>
            )}

            {/* Documents Section for Lawyers */}
            {isLawyer && (profile as LawyerProfileEntity).professionalInfo.documents.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-teal-600 mb-6 text-center">
                  Professional Documents
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(profile as LawyerProfileEntity).professionalInfo.documents.map((document, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                          <FileImage size={20} />
                        </div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide flex-1">
                          Document {index + 1}
                        </h4>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-gray-200 w-full">
                        <img
                          src={document}
                          alt={`Document ${index + 1}`}
                          className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Summary for Lawyers */}
            {isLawyer && (
              <div className="mt-10">
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-200/30">
                  <h3 className="text-xl font-semibold text-teal-700 mb-4 text-center">
                    Professional Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/60 rounded-xl p-4">
                      <div className="text-xl sm:text-2xl font-bold text-teal-600 break-words">
                        {(profile as LawyerProfileEntity).professionalInfo.experience}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Experience</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                      <div className="text-lg sm:text-xl font-bold text-purple-600 break-words leading-tight">
                        {(profile as LawyerProfileEntity).professionalInfo.practiceAreas.slice(0, 2).join(', ')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Practice Areas</div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                      <div className="text-lg sm:text-xl font-bold text-green-600 break-words leading-tight">
                        {(profile as LawyerProfileEntity).professionalInfo.fee}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Consultation Fee</div>
                    </div>
                  </div>
                  <div className="mt-6 bg-white/60 rounded-xl p-4 text-center">
                    <div className="text-base sm:text-lg font-semibold text-indigo-600 break-words leading-relaxed">
                      {(profile as LawyerProfileEntity).professionalInfo.education.degree} from {(profile as LawyerProfileEntity).professionalInfo.education.university}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-2">Educational Background</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;