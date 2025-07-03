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
  Bookmark,
  Clock,
  DollarSign,
  Scale,
  User,
  Award,
} from "lucide-react"
import Navbar from "../../components/userside/Navbar"

export default function LawyerViewPage() {
  const lawyerData = {
    name: "Sarah Mitchell",
    specialization: "Criminal Defense Lawyer",
    rating: 4.8,
    reviewCount: 42,
    court: "Supreme Court of California",
    location: "Los Angeles, CA",
    experience: "12+ Years",
    profileImage: "/placeholder.svg?height=150&width=150",
    personalInfo: {
      dob: "March 15, 1985",
      phone: "+1 (555) 123-4567",
      email: "sarah.mitchell@lawfirm.com",
      languages: ["English", "Spanish", "French"],
      address: "1234 Legal Avenue, Downtown LA, CA 90210",
    },
    professionalInfo: {
      barNumber: "CA-BAR-123456",
      courtName: "Supreme Court of California",
      yearsExperience: 12,
      workLocation: "Los Angeles, California",
      consultationFee: "$300/hour",
      practiceAreas: ["Criminal Defense", "DUI Defense", "White Collar Crime", "Appeals", "Federal Crimes"],
    },
    education: [
      {
        degree: "Juris Doctor (JD)",
        university: "UCLA School of Law",
        year: "2011",
      },
      {
        degree: "Bachelor of Arts in Political Science",
        university: "University of California, Berkeley",
        year: "2008",
      },
    ],
    reviews: [
      {
        username: "Michael R.",
        date: "2 weeks ago",
        rating: 5,
        comment:
          "Exceptional representation in my criminal case. Sarah's expertise and dedication were evident throughout the entire process.",
      },
      {
        username: "Jennifer L.",
        date: "1 month ago",
        rating: 5,
        comment:
          "Professional, knowledgeable, and compassionate. Highly recommend for anyone needing criminal defense.",
      },
      {
        username: "David K.",
        date: "2 months ago",
        rating: 4,
        comment: "Great communication and strong legal strategy. Very satisfied with the outcome of my case.",
      },
    ],
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
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/*<Navbar userName="Ananthan" userAvatar=""/>*/}
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Profile Avatar */}
                  <div className="relative w-32 h-32 rounded-full border-4 border-blue-100 overflow-hidden bg-blue-600 flex items-center justify-center">
                    <img
                      src={lawyerData.profileImage || "/placeholder.svg"}
                      alt={lawyerData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                          const next:any = e.currentTarget.nextElementSibling;
                          if (next) {
                            next.style.display = "flex";
                          }
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-blue-600 text-white text-2xl font-semibold flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      {lawyerData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{lawyerData.name}</h1>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {lawyerData.specialization}
                    </span>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-slate-600">
                      <div className="flex items-center gap-1">
                        {renderStars(lawyerData.rating)}
                        <span className="ml-1 font-semibold">{lawyerData.rating}</span>
                        <span className="text-sm">({lawyerData.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="w-4 h-4" />
                        <span className="text-sm">{lawyerData.court}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{lawyerData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{lawyerData.experience}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </button>
                      <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message Lawyer
                      </button>
                      <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        Save
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
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">About</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium">{lawyerData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="font-medium">{lawyerData.personalInfo.dob}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{lawyerData.personalInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{lawyerData.personalInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Languages</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lawyerData.personalInfo.languages.map((lang) => (
                          <span
                            key={lang}
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-sm">{lawyerData.personalInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Professional Details</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Bar Registration</p>
                      <p className="font-medium">{lawyerData.professionalInfo.barNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Court</p>
                      <p className="font-medium">{lawyerData.professionalInfo.courtName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Experience</p>
                      <p className="font-medium">{lawyerData.professionalInfo.yearsExperience} Years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Work Location</p>
                      <p className="font-medium">{lawyerData.professionalInfo.workLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Consultation Fee</p>
                      <p className="font-medium">{lawyerData.professionalInfo.consultationFee}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-3">Practice Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {lawyerData.professionalInfo.practiceAreas.map((area) => (
                      <span
                        key={area}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Education</h2>
                <div className="space-y-4">
                  {lawyerData.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                        <p className="text-slate-600">{edu.university}</p>
                        <p className="text-sm text-slate-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Client Reviews & Ratings</h2>

                <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-2">{renderStars(lawyerData.rating)}</div>
                  <p className="text-2xl font-bold text-slate-800">{lawyerData.rating}/5</p>
                  <p className="text-sm text-slate-600">Based on {lawyerData.reviewCount} reviews</p>
                </div>

                <div className="space-y-4">
                  {lawyerData.reviews.map((review, index) => (
                    <div key={index} className="border-b border-slate-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800">{review.username}</p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
