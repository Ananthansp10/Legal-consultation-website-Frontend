import type React from "react";
import { useEffect, useState } from "react";
import {
  User,
  Edit3,
  Plus,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  MapPin,
  ChevronDown,
} from "lucide-react";
import UserNavbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { editProfile, getProfile } from "../../services/user/profileService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  DOB: string;
  proffession: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  profileImage: any;
}

// Validation function
const validate = (data: ProfileData | null) => {
  const newErrors: { [key: string]: string } = {};
  if (data) {
    if (!data.name.trim()) newErrors.name = "Full Name is required";
    if (
      !data.email.trim() ||
      !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(data.email)
    )
      newErrors.email = "Valid Email is required";
    if (
      !data.phoneNumber.trim() ||
      !/^[0-9]{10,}$/.test(data.phoneNumber)
    )
      newErrors.phoneNumber = "Valid phone is required";
    if (!data.gender.trim()) newErrors.gender = "Gender is required";
    if (!data.DOB.trim()) newErrors.DOB = "Date of Birth is required";
    if (!data.proffession.trim()) newErrors.proffession = "Profession is required";
    if (!data.company.trim()) newErrors.company = "Company is required";
    if (!data.address.street.trim())
      newErrors["address.street"] = "Street is required";
    if (!data.address.city.trim())
      newErrors["address.city"] = "City is required";
    if (!data.address.state.trim())
      newErrors["address.state"] = "State is required";
    if (!data.address.country.trim())
      newErrors["address.country"] = "Country is required";
    if (!data.address.zipCode.trim())
      newErrors["address.zipCode"] = "Zip Code is required";
  }
  return newErrors;
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // NEW: Error state!
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user)!;

  const handleEditClick = () => {
    setEditData(profileData);
    setImagePreview(null);
    setIsEditModalOpen(true);
    setErrors({});
  };

  const handleSave = () => {
    const validationErrors = validate(editData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const data = new FormData();
    if (editData) {
      data.append("userId", user.id);
      data.append("name", editData.name);
      data.append("email", editData.email);
      data.append("phoneNumber", editData.phoneNumber);
      data.append("DOB", editData.DOB);
      data.append("gender", editData.gender);
      data.append("proffession", editData.proffession);
      data.append("company", editData.company);
      data.append("profileImage", editData.profileImage);
      data.append("street", editData.address.street);
      data.append("state", editData.address.state);
      data.append("city", editData.address.city);
      data.append("country", editData.address.country);
      data.append("zipCode", editData.address.zipCode);
    }
    editProfile(data).then((response) => {
      toast.success(response.data.message);
      setIsEditModalOpen(false);
      fetchProfile();
    });
  };

  const handleCancel = () => {
    setEditData(null);
    setIsEditModalOpen(false);
    setErrors({});
  };

  const handleAddProfile = () => {
    navigate("/user/add-profile");
  };

  function fetchProfile() {
    getProfile(user.id).then((response) => {
      setProfileData(response.data.data);
    });
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  // Enhanced: update validation errors per field
  const updateEditData = (field: string, value: string) => {
    if (!editData) return;

    let updated: ProfileData;
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      updated = {
        ...editData,
        address: {
          ...editData.address,
          [addressField]: value,
        },
      };
    } else {
      updated = {
        ...editData,
        [field]: value,
      };
    }
    setEditData(updated);
    // Partial validation (just the changed field, for performance)
    const errorCheck = validate(updated);
    setErrors((prev) => ({
      ...prev,
      [field]: errorCheck[field] || errorCheck[field.split(".")[1]] || "",
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        if (editData) {
          setEditData({
            ...editData,
            profileImage: file,
          } as any);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (editData) {
      setEditData({
        ...editData,
        profileImage: "/placeholder.svg?height=120&width=120",
      });
    }
  };

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <userNavbar navLink="" />
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-[#334155] mb-2">Profile Settings</h1>
          <p className="text-[#64748b]">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/30 shadow-lg inline-flex">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "personal"
                  ? "bg-[#3b82f6] text-white shadow-lg transform scale-105"
                  : "text-[#64748b] hover:text-[#334155] hover:bg-white/20"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "security"
                  ? "bg-[#3b82f6] text-white shadow-lg transform scale-105"
                  : "text-[#64748b] hover:text-[#334155] hover:bg-white/20"
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "personal" && (
          <div className="transition-all duration-500 ease-in-out">
            {profileData ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  <div className="relative">
                    <img
                      src={profileData.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-[#3b82f6] ring-offset-4 ring-offset-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#3b82f6] rounded-full p-2 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-[#334155] mb-2">{profileData.name}</h2>
                    <p className="text-[#64748b] mb-4">
                      {profileData.proffession} at {profileData.company}
                    </p>
                    <button
                      onClick={handleEditClick}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto md:mx-0"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#334155] mb-4">Personal Information</h3>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <Mail className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Email</p>
                        <p className="text-[#334155] font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <Phone className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Phone</p>
                        <p className="text-[#334155] font-medium">{profileData.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <User className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Gender</p>
                        <p className="text-[#334155] font-medium">{profileData.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <Calendar className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Date of Birth</p>
                        <p className="text-[#334155] font-medium">
                          {new Date(profileData.DOB).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#334155] mb-4">Professional & Address</h3>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Profession</p>
                        <p className="text-[#334155] font-medium">{profileData.proffession}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <Building className="w-5 h-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-sm text-[#64748b]">Company</p>
                        <p className="text-[#334155] font-medium">{profileData.company}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/20 rounded-lg border border-[#e2e8f0]">
                      <MapPin className="w-5 h-5 text-[#3b82f6] mt-1" />
                      <div>
                        <p className="text-sm text-[#64748b]">Address</p>
                        <div className="text-[#334155] font-medium">
                          <p>{profileData.address.street}</p>
                          <p>
                            {profileData.address.city}, {profileData.address.state}
                          </p>
                          <p>
                            {profileData.address.country} {profileData.address.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/30 shadow-lg text-center">
                <div className="w-24 h-24 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-semibold text-[#334155] mb-2">No Profile Yet</h3>
                <p className="text-[#64748b] mb-6">You haven't added your profile yet.</p>
                <button
                  onClick={handleAddProfile}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add Profile
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="transition-all duration-500 ease-in-out">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg">
              <h3 className="text-xl font-semibold text-[#334155] mb-6">Security Settings</h3>
              <p className="text-[#64748b]">Security settings will be implemented here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h2 className="text-xl font-semibold text-[#334155]">{profileData ? "Edit Profile" : "Add Profile"}</h2>
            </div>

            {editData && (
              <div className="p-6 space-y-6">
                {/* Profile Image Edit Section */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-[#e2e8f0]">
                  <div className="relative">
                    <img
                      src={imagePreview || editData.profileImage || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-[#3b82f6] ring-offset-4 ring-offset-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#3b82f6] rounded-full p-2 shadow-lg">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <label className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {(imagePreview ||
                      (editData.profileImage &&
                        editData.profileImage !== "/placeholder.svg?height=120&width=120")) && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-[#64748b] text-center">
                    Upload a new profile picture. Recommended size: 400x400px
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[#334155] mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={editData.name}
                      onChange={(e) => updateEditData("name", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => updateEditData("email", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      readOnly
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#334155] mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={editData.phoneNumber}
                      onChange={(e) => updateEditData("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="relative">
                    <label htmlFor="gender" className="block text-sm font-medium text-[#334155] mb-1">
                      Gender
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm text-left flex items-center justify-between"
                    >
                      <span className={editData.gender ? "text-[#334155]" : "text-[#64748b]"}>
                        {editData.gender || "Select gender"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#64748b]" />
                    </button>
                    {isGenderDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg z-10">
                        {genderOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              updateEditData("gender", option);
                              setIsGenderDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-[#f8fafc] text-[#334155] first:rounded-t-lg last:rounded-b-lg"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.gender && (
                      <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[#334155] mb-1">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={editData.DOB}
                      onChange={(e) => updateEditData("DOB", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                    {errors.DOB && (
                      <p className="text-xs text-red-600 mt-1">{errors.DOB}</p>
                    )}
                  </div>

                  {/* Profession */}
                  <div>
                    <label htmlFor="proffession" className="block text-sm font-medium text-[#334155] mb-1">
                      Profession
                    </label>
                    <input
                      id="profession"
                      type="text"
                      value={editData.proffession}
                      onChange={(e) => updateEditData("proffession", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                    {errors.proffession && (
                      <p className="text-xs text-red-600 mt-1">{errors.proffession}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="md:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-[#334155] mb-1">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={editData.company}
                      onChange={(e) => updateEditData("company", e.target.value)}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                    />
                    {errors.company && (
                      <p className="text-xs text-red-600 mt-1">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-[#334155] mb-3">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-[#334155] mb-1">
                        Street
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={editData.address.street}
                        onChange={(e) => updateEditData("address.street", e.target.value)}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                      {errors["address.street"] && (
                        <p className="text-xs text-red-600 mt-1">{errors["address.street"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#334155] mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={editData.address.city}
                        onChange={(e) => updateEditData("address.city", e.target.value)}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                      {errors["address.city"] && (
                        <p className="text-xs text-red-600 mt-1">{errors["address.city"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-[#334155] mb-1">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={editData.address.state}
                        onChange={(e) => updateEditData("address.state", e.target.value)}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                      {errors["address.state"] && (
                        <p className="text-xs text-red-600 mt-1">{errors["address.state"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-[#334155] mb-1">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={editData.address.country}
                        onChange={(e) => updateEditData("address.country", e.target.value)}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                      {errors["address.country"] && (
                        <p className="text-xs text-red-600 mt-1">{errors["address.country"]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-[#334155] mb-1">
                        Zip Code
                      </label>
                      <input
                        id="zipCode"
                        type="text"
                        value={editData.address.zipCode}
                        onChange={(e) => updateEditData("address.zipCode", e.target.value)}
                        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white/50 backdrop-blur-sm"
                      />
                      {errors["address.zipCode"] && (
                        <p className="text-xs text-red-600 mt-1">{errors["address.zipCode"]}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#e2e8f0]">
                  <button
                    onClick={handleSave}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
