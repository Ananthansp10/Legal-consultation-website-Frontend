import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Wallet,
  CheckCircle,
  Building,
  Clock,
  FileText,
  Settings,
  Plus,
  X,
  Save,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LawyerNavbar from "../../components/lawyer/Navbar";
import {
  editLawyerProfile,
  getLawyerProfile,
} from "../../services/lawyer/lawyerProfileService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { checkBankDetails } from "../../services/lawyer/lawyerService";

export default function LawyerProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [hasProfile, setHasProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const lawyer = useSelector((state: RootState) => state.lawyerAuth.lawyer)!;

  interface Address {
    street: string;
    state: string;
    city: string;
    country: string;
  }

  interface PersonalInfo {
    name: string;
    email: string;
    phoneNumber: string;
    DOB: string;
    address: Address;
    language: string[];
    profileImage: string | null;
  }

  interface Education {
    degree: string;
    university: string;
    year: string;
  }

  interface ProffessionalInfo {
    practiceAreas: [string];
    barRegisterNumber: string;
    experience: string;
    courtName: string;
    workLocation: string;
    fee: string;
    availableDays: [string];
    startTime: string;
    endTime: string;
    education: [Education];
    documents: string[];
  }

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [proffessionalInfo, setProffessionalInfo] =
    useState<ProffessionalInfo | null>(null);
  const [bankDetailsExist, setBankDetailsExist] = useState(false);

  function fetchLawyer() {
    getLawyerProfile(lawyer._id).then((response) => {
      setPersonalInfo(response.data.data.personalInfo);
      setProffessionalInfo(response.data.data.proffessionalInfo);
      setHasProfile(true);
    });
  }

  useEffect(() => {
    fetchLawyer();
  }, []);

  interface EditFormType {
    name: string;
    email: string;
    phoneNumber: string;
    DOB: string;
    address: Address;
    language: string[];
    profileImage: string | null;
    profileImageFile?: File;
    fee: string;
  }

  useEffect(() => {
    checkBankDetails(lawyer._id).then((response) => {
      if (response.data.success) {
        setBankDetailsExist(true);
      }
    });
  }, []);

  // Edit form state
  const [editForm, setEditForm] = useState<
    EditFormType & { profileImageFile?: File }
  >({ ...personalInfo!, fee: proffessionalInfo?.fee! });

  const handleEditClick = () => {
    setEditForm({ ...personalInfo!, fee: proffessionalInfo?.fee! });
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    const data = new FormData();
    data.append("lawyerId", lawyer._id);
    data.append("name", editForm.name);
    data.append("email", editForm.email);
    data.append("phoneNumber", editForm.phoneNumber);
    data.append("DOB", editForm.DOB);
    data.append("street", editForm.address.street);
    data.append("city", editForm.address.city);
    data.append("state", editForm.address.state);
    data.append("country", editForm.address.country);
    if (editForm.fee) {
      data.append("fee", editForm.fee);
    }
    if (editForm.profileImage) {
      data.append("imagePreview", editForm.profileImage);
    }
    editForm.language.forEach((lan) => {
      data.append("language", lan);
    });
    if (editForm.profileImageFile) {
      data.append("profileImage", editForm.profileImageFile);
    }

    editLawyerProfile(data).then((response) => {
      setShowEditModal(false);
      toast.success(response.data.message);
      fetchLawyer();
    });
  };

  type AnyRecord = Record<string, unknown>;

  const handleInputChange = (path: string, value: string) => {
    setEditForm((prevForm) => {
      if (!prevForm) return prevForm;

      const keys = path.split(".");
      const updatedForm: EditFormType & { profileImageFile?: File } = {
        ...prevForm,
      };

      let temp: AnyRecord = updatedForm as unknown as AnyRecord;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        const current = temp[key];
        temp[key] =
          typeof current === "object" && current !== null
            ? { ...(current as object) }
            : {};

        temp = temp[key] as AnyRecord;
      }

      temp[keys[keys.length - 1]] = value;

      return updatedForm;
    });
  };

  const handleLanguageToggle = (language: string) => {
    setEditForm((prev) => ({
      ...prev,
      language: prev.language.includes(language)
        ? prev.language.filter((lang) => lang !== language)
        : [...prev.language, language],
    }));
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
          profileImageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setEditForm((prev) => ({
      ...prev,
      profileImage: null,
      profileImageFile: undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <LawyerNavbar />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Personal Information
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-8 pb-6 border-b border-slate-200">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {editForm?.profileImage ? (
                      <img
                        src={editForm.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                  <button
                    onClick={() =>
                      document.getElementById("profileImageInput")?.click()
                    }
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />

                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Profile Image</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        document.getElementById("profileImageInput")?.click()
                      }
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      Upload New
                    </button>
                    {editForm?.profileImage && (
                      <button
                        onClick={handleRemoveProfileImage}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm?.email}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm?.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editForm?.DOB}
                    onChange={(e) => handleInputChange("DOB", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editForm?.address.street}
                    onChange={(e) =>
                      handleInputChange("address.street", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm?.address.city}
                    onChange={(e) =>
                      handleInputChange("address.city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    State
                  </label>
                  <input
                    type="text"
                    value={editForm?.address.state}
                    onChange={(e) =>
                      handleInputChange("address.state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editForm?.address.country}
                    onChange={(e) =>
                      handleInputChange("address.country", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Fee
                  </label>
                  <input
                    type="text"
                    value={editForm?.fee || ""}
                    onChange={(e) => handleInputChange("fee", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Languages */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Languages Spoken
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "English",
                      "Malayalam",
                      "Hindi",
                      "Spanish",
                      "French",
                      "German",
                      "Italian",
                      "Portuguese",
                      "Mandarin",
                      "Japanese",
                    ].map((language) => (
                      <label
                        key={language}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editForm?.language.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">
                          {language}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
          <p className="text-slate-600">
            Manage your professional information and account settings
          </p>
        </div>

        {/* Main Content */}
        {hasProfile ? (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="glass-card rounded-2xl p-2 bg-white/30 backdrop-blur-md border border-slate-200">
              <div className="grid grid-cols-5 bg-transparent gap-2">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === "personal"
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Personal Info</span>
                  <span className="sm:hidden">Personal</span>
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === "professional"
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Building className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Professional</span>
                  <span className="sm:hidden">Work</span>
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === "documents"
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </button>
                {!bankDetailsExist && (
                  <button
                    onClick={() => navigate("/lawyer/add-bank-details")}
                    className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                      activeTab === "wallet"
                        ? "bg-blue-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Add Bank Details
                  </button>
                )}
              </div>
            </div>

            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Image Card */}
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                    <div className="flex flex-col items-center p-6">
                      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                        <img
                          src={personalInfo?.profileImage ?? undefined}
                          alt="Profile"
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
                        <div className="text-2xl text-blue-600 font-semibold hidden">
                          JD
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-1">
                        {personalInfo?.name}
                      </h3>
                      <p className="text-slate-600 mb-4">Senior Advocate</p>
                      <button
                        onClick={handleEditClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                Full Name
                              </label>
                              <div className="flex items-center space-x-2 text-slate-600">
                                <User className="w-4 h-4" />
                                <span>{personalInfo?.name}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                Email
                              </label>
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Mail className="w-4 h-4" />
                                <span>{personalInfo?.email}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                Phone
                              </label>
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Phone className="w-4 h-4" />
                                <span>{personalInfo?.phoneNumber}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700">
                                Date of Birth
                              </label>
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDisplayDate(personalInfo?.DOB ?? "")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                          Address & Languages
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Address
                            </label>
                            <div className="flex items-start space-x-2 text-slate-600">
                              <MapPin className="w-4 h-4 mt-1" />
                              <div>
                                <p>{personalInfo?.address?.street}</p>
                                <p>
                                  {personalInfo?.address?.city},{" "}
                                  {personalInfo?.address?.state},{" "}
                                  {personalInfo?.address?.country}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              Languages Spoken
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {personalInfo?.language?.map(
                                (language, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {language}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Info Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Practice Information
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Practice Areas
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {proffessionalInfo?.practiceAreas.map((areas) => (
                              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                {areas}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Bar Registration Number
                          </label>
                          <p className="text-slate-600">
                            {proffessionalInfo?.barRegisterNumber}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Years of Experience
                          </label>
                          <p className="text-slate-600">
                            {proffessionalInfo?.experience} Years
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Current Law Firm
                          </label>
                          <p className="text-slate-600">
                            {proffessionalInfo?.courtName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">
                        Education & Verification
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Education
                          </label>
                          <div className="space-y-2">
                            {proffessionalInfo?.education.map((ed) => (
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-medium text-slate-800">
                                  {ed.degree}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {ed.university}, {ed.year}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            License Verification
                          </label>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card border-slate-200 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border">
                  <div className="p-6">
                    <h3 className="flex items-center text-xl font-semibold text-slate-800 mb-4">
                      <Clock className="w-5 h-5 mr-2" />
                      Availability
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {proffessionalInfo?.availableDays.map((day) => (
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-slate-800">{day}</p>
                          <p className="text-sm text-slate-600">
                            {proffessionalInfo.startTime} AM -{" "}
                            {proffessionalInfo.endTime} PM
                          </p>
                        </div>
                      ))}
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Availability
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Bar Council ID */}
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">
                          Bar Council ID
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <img src={proffessionalInfo?.documents[0]} alt="" />
                    </div>
                  </div>

                  {/* Law Degree */}
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">
                          Law Degree
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <img src={proffessionalInfo?.documents[1]} alt="" />
                    </div>
                  </div>

                  {/* ID Proof (Aadhar) */}
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">
                          ID Proof (Aadhar)
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <img src={proffessionalInfo?.documents[3]} alt="" />
                    </div>
                  </div>
                  {/* Professional Certificate */}
                  <div className="glass-card border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-white/30 backdrop-blur-md border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800">
                          Professional Certificate
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <img src={proffessionalInfo?.documents[2]} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white/30 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-12 max-w-xl w-full">
              <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                No Profile Found
              </h2>
              <p className="text-slate-600 mb-6">
                You haven’t set up your professional profile yet. Add your
                personal and professional details to get started.
              </p>
              <button
                onClick={() => navigate("/lawyer/add-profile")}
                className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
