import React, { useState } from "react";
import {
  Camera,
  Calendar,
  Clock,
  Plus,
  X,
  Upload,
  ArrowLeft,
  Check,
  FileText,
} from "lucide-react";
import LawyerNavbar from "../../components/lawyer/Navbar";
import { addLawyerProfile } from "../../services/lawyer/lawyerProfileService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

interface Education {
  id: string;
  degree: string;
  university: string;
  year: string;
}

interface FormData {
  profileImage: File | null;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  country: string;
  languages: string[];
  practiceAreas: string[];
  barRegistrationNumber: string;
  yearsOfExperience: string;
  consultationFee: string;
  lawFirm: string;
  workLocation: string;
  availableDays: string[];
  timeSlotStart: string;
  timeSlotEnd: string;
  education: Education[];
  documents: {
    barCouncilId: File | null;
    degreeCertificate: File | null;
    experienceCertificate: File | null;
    idProof: File | null;
  };
}

const languages = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Marathi",
];
const practiceAreaOptions = [
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Property Law",
  "Civil Law",
  "Tax Law",
  "Immigration Law",
  "Intellectual Property",
];
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function LawyerProfileAddPage() {
  const lawyer = useSelector((state: RootState) => state.lawyerAuth.lawyer);
  const [formData, setFormData] = useState<FormData>({
    profileImage: null,
    fullName: lawyer?.name || "",
    email: lawyer?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    country: "",
    languages: [],
    practiceAreas: [],
    barRegistrationNumber: "",
    yearsOfExperience: "",
    consultationFee: "",
    lawFirm: "",
    workLocation: "",
    availableDays: [],
    timeSlotStart: "",
    timeSlotEnd: "",
    education: [],
    documents: {
      barCouncilId: null,
      degreeCertificate: null,
      experienceCertificate: null,
      idProof: null,
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
    setErrors((prev) => ({ ...prev, languages: "" }));
  };

  const handlePracticeAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter((a) => a !== area)
        : [...prev.practiceAreas, area],
    }));
    setErrors((prev) => ({ ...prev, practiceAreas: "" }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
    setErrors((prev) => ({ ...prev, availableDays: "" }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleDocumentUpload = (
    docType: keyof FormData["documents"],
    file: File,
  ) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file,
      },
    }));
    setErrors((prev) => ({ ...prev, [docType]: "" }));
  };

  const removeDocument = (docType: keyof FormData["documents"]) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null,
      },
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      university: "",
      year: "",
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const removeEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      [`education-${field}-${id}`]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number.";
    if (formData.practiceAreas.length === 0)
      newErrors.practiceAreas = "Select at least one practice area.";
    if (!formData.barRegistrationNumber.trim())
      newErrors.barRegistrationNumber = "Bar registration number is required.";
    if (!formData.yearsOfExperience.trim())
      newErrors.yearsOfExperience = "Years of experience is required.";
    else if (
      isNaN(Number(formData.yearsOfExperience)) ||
      Number(formData.yearsOfExperience) < 0
    )
      newErrors.yearsOfExperience = "Enter a valid number.";
    if (!formData.consultationFee.trim())
      newErrors.consultationFee = "Consultation fee is required.";
    else if (
      isNaN(Number(formData.consultationFee)) ||
      Number(formData.consultationFee) < 0
    )
      newErrors.consultationFee = "Enter a valid fee.";
    if (!formData.workLocation.trim())
      newErrors.workLocation = "Work location required.";
    if (formData.availableDays.length === 0)
      newErrors.availableDays = "Select at least one day.";
    if (!formData.documents.barCouncilId)
      newErrors.barCouncilId = "Bar council ID is required.";
    if (!formData.documents.degreeCertificate)
      newErrors.degreeCertificate = "Degree certificate is required.";
    if (!formData.documents.idProof)
      newErrors.idProof = "ID proof is required.";
    if (!formData.documents.experienceCertificate)
      newErrors.experienceCertificate = "Expereience certificate is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth.trim())
      newErrors.dob = "Date of birth is required";
    if (!formData.street.trim()) newErrors.street = "street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.lawFirm.trim()) newErrors.lawFirm = "Law firm is required";
    if (!formData.timeSlotStart.trim())
      newErrors.timeSlotStart = "start time is required";
    if (!formData.timeSlotEnd.trim())
      newErrors.timeSlotEnd = "End time is required";
    if (formData.languages.length == 0)
      newErrors.languages = "Languages is required";
    if (!formData.profileImage)
      newErrors.profileImage = "profile Image is required";
    if (
      new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear() <
      18
    )
      newErrors.dob =
        "Date of birth should be greater than or equal to 18 years"; // Example for education
    formData.education.forEach((edu, i) => {
      if (!edu.degree)
        newErrors[`education-degree-${edu.id}`] = "Degree required.";
      if (!edu.university)
        newErrors[`education-university-${edu.id}`] = "University required.";
      if (!edu.year || !/^\d{4}$/.test(edu.year))
        newErrors[`education-year-${edu.id}`] = "Valid year required.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("lawyerId", lawyer?._id!);
    data.append("name", formData.fullName);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phone);
    data.append("DOB", formData.dateOfBirth);
    data.append("gender", formData.gender);
    data.append("street", formData.street);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("city", formData.city);
    formData.languages.forEach((lan) => {
      data.append("language[]", lan);
    });
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }
    formData.practiceAreas.forEach((area) => {
      data.append("practiceAreas[]", area);
    });
    data.append("barRegisterNumber", formData.barRegistrationNumber);
    data.append("experience", formData.yearsOfExperience);
    data.append("courtName", formData.lawFirm);
    data.append("workLocation", formData.workLocation);
    data.append("fee", formData.consultationFee);
    formData.education.forEach((edu, index) => {
      data.append(`education[${index}][degree]`, edu.degree);
      data.append(`education[${index}][university]`, edu.university);
      data.append(`education[${index}][year]`, edu.year);
    });
    formData.availableDays.forEach((day) => {
      data.append("availableDays[]", day);
    });
    data.append("startTime", formData.timeSlotStart);
    data.append("endTime", formData.timeSlotEnd);
    if (formData.documents.barCouncilId) {
      data.append("barCouncilCertificate", formData.documents.barCouncilId);
    }
    if (formData.documents.degreeCertificate) {
      data.append("degreeCertificate", formData.documents.degreeCertificate);
    }
    if (formData.documents.experienceCertificate) {
      data.append(
        "experienceCertificate",
        formData.documents.experienceCertificate,
      );
    }
    if (formData.documents.idProof) {
      data.append("idProof", formData.documents.idProof);
    }
    addLawyerProfile(data).then((response) => {
      toast.success(response.data.message);
      navigate("/lawyer-profile-page");
    });
  };

  const handleSaveAsDraft = () => {
    console.log("Saving as draft:", formData);
  }; // Document upload component

  const DocumentUploadCard = ({
    docKey,
    label,
    required = false,
  }: {
    docKey: keyof FormData["documents"];
    label: string;
    required?: boolean;
  }) => {
    const file = formData.documents[docKey];
    return (
      <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
               {" "}
        <div className="flex flex-col items-center space-y-2">
                   {" "}
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                       {" "}
            {file ? (
              <FileText className="w-6 h-6 text-green-500" />
            ) : (
              <Upload className="w-6 h-6 text-slate-400" />
            )}
                     {" "}
          </div>
                   {" "}
          <div>
                       {" "}
            <p className="text-sm font-medium text-slate-900">
                            {label}{" "}
              {required && <span className="text-red-500">*</span>}         
               {" "}
            </p>
                       {" "}
            {file ? (
              <div className="mt-1">
                               {" "}
                <p className="text-xs text-green-600">{file.name}</p>           
                   {" "}
                <button
                  type="button"
                  onClick={() => removeDocument(docKey)}
                  className="text-xs text-red-500 hover:text-red-600 mt-1"
                >
                                    Remove                {" "}
                </button>
                             {" "}
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Click to upload or drag and drop
              </p>
            )}
                       {" "}
            {errors[docKey] && (
              <p className="text-xs text-red-500 mt-1">{errors[docKey]}</p>
            )}
                     {" "}
          </div>
                   {" "}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                handleDocumentUpload(docKey, selectedFile);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
                 {" "}
        </div>
             {" "}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
            <LawyerNavbar />     {" "}
      <div className="sticky z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200 mt-5">
               {" "}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                   {" "}
          <div className="flex items-center justify-between h-16">
                       {" "}
            <div className="flex items-center space-x-4">
                           {" "}
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                             {" "}
              </button>
                           {" "}
              <div className="text-sm text-slate-500">
                                Dashboard / Lawyers /{" "}
                <span className="text-slate-900 font-medium">Add Profile</span> 
                           {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {" "}
        <div className="mb-8">
                   {" "}
          <h1 className="text-3xl font-bold text-slate-900">
            Add Lawyer Profile
          </h1>
                   {" "}
          <p className="text-slate-600 mt-2">
            Complete your professional profile to get started
          </p>
                 {" "}
        </div>
               {" "}
        <form onSubmit={handleSubmit} className="space-y-8">
                   {" "}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                       {" "}
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Personal Information
            </h2>
                       {" "}
            <div className="flex justify-center mb-8">
                           {" "}
              <div className="relative">
                               {" "}
                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
                                   {" "}
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                                           {" "}
                      <Camera className="w-8 h-8 text-slate-400" />             
                           {" "}
                    </div>
                  )}
                                 {" "}
                </div>
                               {" "}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                               {" "}
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg">
                                    <Camera className="w-4 h-4 text-white" />   
                             {" "}
                </div>
                             {" "}
              </div>
              {errors.profileImage && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.profileImage}
                </p>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
                               {" "}
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                               {" "}
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
                               {" "}
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                               {" "}
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your phone number"
                />
                               {" "}
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>
                               {" "}
                <div className="relative">
                                   {" "}
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                                   {" "}
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                                 {" "}
                </div>
                               {" "}
                {errors.dob && (
                  <p className="text-xs text-red-500 mt-1">{errors.dob}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                               {" "}
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                                    <option value="">Select Gender</option>     
                              <option value="male">Male</option>               
                    <option value="female">Female</option>                 {" "}
                  <option value="other">Other</option>               {" "}
                </select>
                               {" "}
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your street address"
                />
                               {" "}
                {errors.street && (
                  <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your city"
                />
                               {" "}
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your state"
                />
                               {" "}
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your country"
                />
                               {" "}
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                )}
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="mt-6">
                           {" "}
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Languages Spoken
              </label>
                           {" "}
              <div className="flex flex-wrap gap-2">
                               {" "}
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.languages.includes(language)
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                                        {language}                 {" "}
                  </button>
                ))}
                             {" "}
              </div>
                           {" "}
              {errors.languages && (
                <p className="text-xs text-red-500 mt-1">{errors.languages}</p>
              )}
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                       {" "}
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Professional Information
            </h2>
                       {" "}
            <div className="mb-6">
                           {" "}
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Practice Areas *
              </label>
                           {" "}
              <div className="flex flex-wrap gap-2">
                               {" "}
                {practiceAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handlePracticeAreaToggle(area)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.practiceAreas.includes(area)
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                                        {area}                 {" "}
                  </button>
                ))}
                             {" "}
              </div>
                           {" "}
              {errors.practiceAreas && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.practiceAreas}
                </p>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bar Registration Number *
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.barRegistrationNumber}
                  onChange={(e) =>
                    handleInputChange("barRegistrationNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your bar registration number"
                />
                               {" "}
                {errors.barRegistrationNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.barRegistrationNumber}
                  </p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Years of Experience *
                </label>
                               {" "}
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    handleInputChange("yearsOfExperience", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter years of experience"
                />
                               {" "}
                {errors.yearsOfExperience && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.yearsOfExperience}
                  </p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Consultation Fee (₹) *
                </label>
                               {" "}
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    handleInputChange("consultationFee", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter consultation fee"
                />
                               {" "}
                {errors.consultationFee && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.consultationFee}
                  </p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Law Firm/Court Name
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.lawFirm}
                  onChange={(e) => handleInputChange("lawFirm", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter law firm or court name"
                />
                               {" "}
                {errors.lawFirm && (
                  <p className="text-xs text-red-500 mt-1">{errors.lawFirm}</p>
                )}
                             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Location (City) *
                </label>
                               {" "}
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) =>
                    handleInputChange("workLocation", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter work location"
                />
                               {" "}
                {errors.workLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.workLocation}
                  </p>
                )}
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="mt-6">
                           {" "}
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Available Days *
              </label>
                           {" "}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                               {" "}
                {weekDays.map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                                       {" "}
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                    />
                                       {" "}
                    <span className="text-sm text-slate-700">
                      {day.slice(0, 3)}
                    </span>
                                     {" "}
                  </label>
                ))}
                             {" "}
              </div>
                           {" "}
              {errors.availableDays && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.availableDays}
                </p>
              )}
                         {" "}
            </div>
                       {" "}
            <div className="mt-6">
                           {" "}
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Available Time Slots
              </label>
                           {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm text-slate-600 mb-1">
                    Start Time
                  </label>
                                   {" "}
                  <div className="relative">
                                       {" "}
                    <input
                      type="time"
                      value={formData.timeSlotStart}
                      onChange={(e) =>
                        handleInputChange("timeSlotStart", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                                       {" "}
                    <Clock className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                                     {" "}
                  </div>
                                   {" "}
                  {errors.timeSlotStart && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.timeSlotStart}
                    </p>
                  )}
                                 {" "}
                </div>
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm text-slate-600 mb-1">
                    End Time
                  </label>
                                   {" "}
                  <div className="relative">
                                       {" "}
                    <input
                      type="time"
                      value={formData.timeSlotEnd}
                      onChange={(e) =>
                        handleInputChange("timeSlotEnd", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                                       {" "}
                    <Clock className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
                                     {" "}
                  </div>
                                   {" "}
                  {errors.timeSlotEnd && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.timeSlotEnd}
                    </p>
                  )}
                                 {" "}
                </div>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="mt-6">
                           {" "}
              <div className="flex items-center justify-between mb-3">
                               {" "}
                <label className="text-sm font-medium text-slate-700">
                  Education
                </label>
                               {" "}
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
                >
                                    <Plus className="w-4 h-4" />               
                    <span className="text-sm">Add Education</span>             
                   {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              {formData.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg"
                >
                                   {" "}
                  <div>
                                       {" "}
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Degree"
                    />
                                       {" "}
                    {errors[`education-degree-${edu.id}`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`education-degree-${edu.id}`]}
                      </p>
                    )}
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <input
                      type="text"
                      value={edu.university}
                      onChange={(e) =>
                        updateEducation(edu.id, "university", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="University"
                    />
                                       {" "}
                    {errors[`education-university-${edu.id}`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`education-university-${edu.id}`]}
                      </p>
                    )}
                                     {" "}
                  </div>
                                   {" "}
                  <div>
                                       {" "}
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) =>
                        updateEducation(edu.id, "year", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Year"
                    />
                                       {" "}
                    {errors[`education-year-${edu.id}`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`education-year-${edu.id}`]}
                      </p>
                    )}
                                     {" "}
                  </div>
                                   {" "}
                  <div className="flex items-center justify-end">
                                       {" "}
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                                            <X className="w-4 h-4" />           
                             {" "}
                    </button>
                                     {" "}
                  </div>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                       {" "}
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Document Upload
            </h2>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {" "}
              <DocumentUploadCard
                docKey="barCouncilId"
                label="Bar Council ID"
                required={true}
              />
                           {" "}
              <DocumentUploadCard
                docKey="degreeCertificate"
                label="Degree Certificate"
                required={true}
              />
                           {" "}
              <DocumentUploadCard
                docKey="experienceCertificate"
                label="Experience Certificate"
                required={true}
              />
                           {" "}
              <DocumentUploadCard
                docKey="idProof"
                label="ID Proof"
                required={true}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                       {" "}
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
                            Cancel            {" "}
            </button>
                       {" "}
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="w-full sm:w-auto px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
                            Save as Draft            {" "}
            </button>
                       {" "}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
                            <Check className="w-4 h-4" />             {" "}
              <span>Submit Profile</span>           {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </form>
             {" "}
      </div>
         {" "}
    </div>
  );
}

export default LawyerProfileAddPage;
