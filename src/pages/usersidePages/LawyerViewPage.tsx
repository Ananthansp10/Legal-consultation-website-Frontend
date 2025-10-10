import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Home,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Clock,
  DollarSign,
  Scale,
  User,
  Award,
  AlertCircle,
} from "lucide-react";
import UserNavbar from "../../components/userside/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLawyerDetails, getReview } from "../../services/user/userService";
import ReportModal from "../../components/reusableComponents/ReportModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Address {
  street: string;
  country: string;
  state: string;
  city: string;
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

interface ProffessionalInfo {
  practiceAreas: string[];
  barRegisterNumber: string;
  experience: string;
  courtName: string;
  workLocation: string;
  fee: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  education: Education[];
  documents: string[];
}

export interface LawyerProfileData {
  _id?: string;
  lawyerId: string;
  personalInfo: PersonalInfo;
  proffessionalInfo: ProffessionalInfo;
}

interface Review {
  userName: string;
  date: string;
  feedback: string;
  rating: number;
}

interface ReviewsData {
  reviewsCount: number;
  rating: number;
  reviews: Review[];
}

export default function LawyerViewPage() {
  const { lawyerId } = useParams();
  const userId: string | undefined = useSelector(
    (state: RootState) => state.auth.user?.id,
  );

  const [lawyerData, setLawyerData] = useState<LawyerProfileData>();
  const [showReportModal, setShowReportModal] = useState(false);

  const [review, setReview] = useState<ReviewsData | null>(null);

  useEffect(() => {
    getLawyerDetails(lawyerId!).then((response) => {
      setLawyerData(response.data.data);
    });
  }, [lawyerId]);

  const navigate = useNavigate();

  useEffect(() => {
    getReview(lawyerId!).then((response) => {
      setReview(response.data.data);
    });
  }, []);

  function report() {
    setShowReportModal(true);
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <UserNavbar navLink="Lawyers" />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white mt-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Profile Avatar */}
                  <div className="relative w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden bg-blue-600 flex items-center justify-center">
                    <img
                      src={lawyerData?.personalInfo?.profileImage}
                      alt={lawyerData?.personalInfo?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const next = e.currentTarget
                          .nextElementSibling as HTMLElement | null;
                        if (next) {
                          next.style.display = "flex";
                        }
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-blue-600 text-white text-2xl font-semibold flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      {lawyerData?.personalInfo?.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                      {lawyerData?.personalInfo?.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lawyerData?.proffessionalInfo?.practiceAreas?.map(
                        (area: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ),
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-slate-600">
                      <div className="flex items-center gap-1">
                        {renderStars(review?.rating ?? 123)}
                        <span className="ml-1 font-semibold">{}</span>
                        <span className="text-sm">
                          ({review?.reviewsCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="w-4 h-4" />
                        <span className="text-sm">
                          {lawyerData?.proffessionalInfo?.courtName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {lawyerData?.proffessionalInfo?.workLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">
                          {lawyerData?.proffessionalInfo?.experience}+ years
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        onClick={() =>
                          navigate(`/user/slot-booking/${lawyerId}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/user/chat-view-page/${lawyerId}`)
                        }
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message Lawyer
                      </button>
                      <button
                        onClick={report}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Report Lawyer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  About
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium">
                        {lawyerData?.personalInfo?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="font-medium">
                        {lawyerData?.personalInfo?.DOB}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">
                        {lawyerData?.personalInfo?.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">
                        {lawyerData?.personalInfo?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Languages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lawyerData?.personalInfo?.language.map(
                          (lang: string) => (
                            <span
                              key={lang}
                              className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {lang}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-sm">
                        {lawyerData?.personalInfo?.address.street}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  Professional Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Bar Registration</p>
                      <p className="font-medium">
                        {lawyerData?.proffessionalInfo?.barRegisterNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Court</p>
                      <p className="font-medium">
                        {lawyerData?.proffessionalInfo?.courtName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Experience</p>
                      <p className="font-medium">
                        {lawyerData?.proffessionalInfo?.experience} Years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Work Location</p>
                      <p className="font-medium">
                        {lawyerData?.proffessionalInfo?.workLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Consultation Fee</p>
                      <p className="font-medium">
                        {lawyerData?.proffessionalInfo?.fee}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-3">Practice Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {lawyerData?.proffessionalInfo?.practiceAreas.map(
                      (area: string) => (
                        <span
                          key={area}
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                        >
                          {area}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  Education
                </h2>
                <div className="space-y-4">
                  {lawyerData?.proffessionalInfo?.education.map(
                    (edu: Education, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg"
                      >
                        <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {edu?.degree}
                          </h3>
                          <p className="text-slate-600">{edu?.university}</p>
                          <p className="text-sm text-slate-500">{edu?.year}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  Client Reviews & Ratings
                </h2>

                <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(review?.rating || 0)}
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {review?.rating}/5
                  </p>
                  <p className="text-sm text-slate-600">
                    Based on {review?.reviewsCount} reviews
                  </p>
                </div>

                <div className="space-y-4">
                  {review?.reviews?.slice(0, 3).map((review, index: number) => (
                    <div
                      key={index}
                      className="border-b border-slate-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800">
                          {review?.userName}
                        </p>
                        <p className="text-xs text-slate-500">{review?.date}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(review?.rating)}
                      </div>
                      <p className="text-sm text-slate-600">
                        {review?.feedback}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/reviews/${lawyerId}`}
                  className="float-right text-blue-500 font-semibold"
                >
                  View All
                </Link>

                <button
                  onClick={() => navigate(`/feedback/${lawyerData?.lawyerId}`)}
                  className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReportModal && (
        <ReportModal
          isOpen={true}
          onClose={() => setShowReportModal(false)}
          reportType="lawyer"
          reportedId={lawyerData?.lawyerId ?? ''}
          reporterId={userId!}
        />
      )}
    </div>
  );
}
