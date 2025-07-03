import type React from "react"
import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  GraduationCap,
  Upload,
  X,
  Plus,
  Save,
  Send,
  ArrowLeft,
  Globe,
  Building,
  FileText,
  Camera,
} from "lucide-react"
import Navbar from "../../components/lawyer/Navbar"
import { useNavigate } from "react-router-dom"

function LawyerProfileAddPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [practiceAreas, setPracticeAreas] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [education, setEducation] = useState([{ degree: "", university: "", year: "" }])
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    barCouncilId: null,
    lawDegree: null,
    identityProof: null,
    extraDocs: null,
  })

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const practiceAreaOptions = [
    "Criminal Law",
    "Civil Law",
    "Corporate Law",
    "Family Law",
    "Property Law",
    "Tax Law",
    "Labour Law",
    "Constitutional Law",
  ]
  const languageOptions = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handlePracticeAreaToggle = (area: string) => {
    setPracticeAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  const handleLanguageToggle = (language: string) => {
    setLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const addEducation = () => {
    setEducation((prev) => [...prev, { degree: "", university: "", year: "" }])
  }

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setEducation((prev) => prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)))
  }

  const handleDocumentUpload = (type: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [type]: file }))
  }

  const removeDocument = (type: string) => {
    setDocuments((prev) => ({ ...prev, [type]: null }))
  }

  const navigate=useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar/>
      <div className="sticky top-0 mt-5 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={()=>navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" style={{ color: "#64748b" }} />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#334155" }}>
                  Add Lawyer Profile
                </h1>
                <p className="text-sm" style={{ color: "#64748b" }}>
                  Dashboard &gt; Profile &gt; Add
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div
            className="glass-card p-8 animate-fade-up"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "1rem",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6" style={{ color: "#3b82f6" }} />
              <h2 className="text-xl font-semibold" style={{ color: "#334155" }}>
                Personal Information
              </h2>
            </div>

            {/* Profile Image Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div
                  className="w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: "#e2e8f0" }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8" style={{ color: "#64748b" }} />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <User className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Mail className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Phone className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
              </div>

              <div>
                <select
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#334155" }}>
                  <Globe className="inline w-4 h-4 mr-2" />
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        languages.includes(language) ? "text-white" : "bg-white/50 hover:bg-white/70"
                      }`}
                      style={{
                        backgroundColor: languages.includes(language) ? "#3b82f6" : undefined,
                        color: languages.includes(language) ? "white" : "#64748b",
                        border: `1px solid ${languages.includes(language) ? "#3b82f6" : "#e2e8f0"}`,
                      }}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div
            className="glass-card p-8 animate-fade-up"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "1rem",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
              animationDelay: "0.1s",
            }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Briefcase className="w-6 h-6" style={{ color: "#3b82f6" }} />
              <h2 className="text-xl font-semibold" style={{ color: "#334155" }}>
                Professional Information
              </h2>
            </div>

            <div className="space-y-6">
              {/* Practice Areas */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#334155" }}>
                  Practice Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {practiceAreaOptions.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handlePracticeAreaToggle(area)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        practiceAreas.includes(area) ? "text-white" : "bg-white/50 hover:bg-white/70"
                      }`}
                      style={{
                        backgroundColor: practiceAreas.includes(area) ? "#3b82f6" : undefined,
                        color: practiceAreas.includes(area) ? "white" : "#64748b",
                        border: `1px solid ${practiceAreas.includes(area) ? "#3b82f6" : "#e2e8f0"}`,
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Bar Registration Number"
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
                <input
                  type="number"
                  placeholder="Years of Experience"
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
                <input
                  type="text"
                  placeholder="Consultation Fee"
                  className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: "#e2e8f0",
                    color: "#334155",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Law Firm/Court Name"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Building className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Work Location (City)"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <MapPin className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#334155" }}>
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Available Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="w-4 h-4 rounded border-2 focus:ring-2"
                        style={{
                          accentColor: "#3b82f6",
                          borderColor: "#e2e8f0",
                        }}
                      />
                      <span className="text-sm" style={{ color: "#64748b" }}>
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="time"
                    placeholder="Start Time"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    placeholder="End Time"
                    className="w-full px-4 py-3 rounded-lg border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5" style={{ color: "#64748b" }} />
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium" style={{ color: "#334155" }}>
                    <GraduationCap className="inline w-4 h-4 mr-2" />
                    Education
                  </label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    style={{ color: "#3b82f6" }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-4 mr-12">
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-white/30 backdrop-blur-sm"
                    >
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        className="px-3 py-2 rounded border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: "#e2e8f0",
                          color: "#334155",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="University"
                        value={edu.university}
                        onChange={(e) => updateEducation(index, "university", e.target.value)}
                        className="px-3 py-2 rounded border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: "#e2e8f0",
                          color: "#334155",
                        }}
                      />
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => updateEducation(index, "year", e.target.value)}
                          className="flex-1 px-3 py-2 rounded border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all"
                          style={{
                            borderColor: "#e2e8f0",
                            color: "#334155",
                          }}
                        />
                        {education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="p-2 rounded hover:bg-red-100 transition-colors"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div
          className="glass-card p-8 mt-8 animate-fade-up"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "1rem",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
            animationDelay: "0.2s",
          }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6" style={{ color: "#3b82f6" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#334155" }}>
              Document Upload
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "barCouncilId", label: "Bar Council ID", required: true },
              { key: "lawDegree", label: "Law Degree Certificate", required: true },
              { key: "identityProof", label: "Identity Proof (Aadhar/PAN)", required: true },
              { key: "extraDocs", label: "Additional Documents", required: false },
            ].map((doc) => (
              <div key={doc.key}>
                <label className="block text-sm font-medium mb-2" style={{ color: "#334155" }}>
                  {doc.label} {doc.required && <span className="text-red-500">*</span>}
                </label>
                {documents[doc.key] ? (
                  <div
                    className="flex items-center justify-between p-4 rounded-lg bg-white/30 backdrop-blur-sm border"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" style={{ color: "#3b82f6" }} />
                      <span className="text-sm" style={{ color: "#334155" }}>
                        {documents[doc.key]?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.key)}
                      className="p-1 rounded hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleDocumentUpload(doc.key, file)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "#64748b" }} />
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            className="px-6 py-3 rounded-lg border transition-all hover:bg-white/20"
            style={{ borderColor: "#e2e8f0", color: "#64748b" }}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-lg border transition-all hover:bg-gray-100"
            style={{ borderColor: "#e2e8f0", color: "#64748b", backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          >
            <Save className="inline w-4 h-4 mr-2" />
            Save as Draft
          </button>
          <button
            className="px-8 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: "#3b82f6" }}
          >
            <Send className="inline w-4 h-4 mr-2" />
            Submit Profile
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        
        .glass-card {
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
        }
        
        input:focus, select:focus {
          ring-color: #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  )
}

 export default LawyerProfileAddPage;
