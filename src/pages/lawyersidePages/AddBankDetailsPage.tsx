import React, { useState } from "react";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { addBankAccount } from "../../services/user/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
}

interface FormErrors {
  [key: string]: string;
}

function AddBankDetailsPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const lawyerId: string | undefined = useSelector(
    (state: RootState) => state.lawyerAuth.lawyer?._id,
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        return value.trim().length < 2
          ? "Full name must be at least 2 characters"
          : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "phoneNumber":
        const phoneRegex = /^[6-9]\d{9}$/;
        return !phoneRegex.test(value)
          ? "Please enter a valid 10-digit phone number"
          : "";
      case "accountNumber":
        return value.length < 9 || value.length > 18
          ? "Account number must be 9-18 digits"
          : "";
      case "confirmAccountNumber":
        return value !== formData.accountNumber
          ? "Account numbers do not match"
          : "";
      case "ifscCode":
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return !ifscRegex.test(value.toUpperCase())
          ? "Please enter a valid IFSC code (e.g., SBIN0123456)"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format specific fields
    let formattedValue = value;
    if (name === "ifscCode") {
      formattedValue = value.toUpperCase();
    } else if (
      name === "phoneNumber" ||
      name === "accountNumber" ||
      name === "confirmAccountNumber"
    ) {
      formattedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Special case for confirm account number - validate when account number changes
    if (name === "accountNumber" && touched.confirmAccountNumber) {
      const confirmError =
        formData.confirmAccountNumber !== formattedValue
          ? "Account numbers do not match"
          : "";
      setErrors((prev) => ({
        ...prev,
        confirmAccountNumber: confirmError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: FormErrors = {};
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "accountNumber",
      "confirmAccountNumber",
      "ifscCode",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field] = error;
    });

    const newTouched: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      addBankAccount({
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bankAccountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        lawyerId: lawyerId,
      }).then((response) => {
        toast.success(response.data.message);
        navigate(-1);
      });
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Bank Details Saved!
          </h2>
          <p className="text-gray-600 mb-6">
            Your bank details have been securely saved and are ready for
            payouts.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                accountNumber: "",
                confirmAccountNumber: "",
                ifscCode: "",
                bankName: "",
              });
              setErrors({});
              setTouched({});
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Add Bank Details
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your bank information for secure payouts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name (as per bank) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.fullName && touched.fullName
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && touched.fullName && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.email && touched.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.phoneNumber && touched.phoneNumber
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="9876543210"
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Bank Account Number */}
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={18}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.accountNumber && touched.accountNumber
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="123456789012"
            />
            {errors.accountNumber && touched.accountNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.accountNumber}
              </p>
            )}
          </div>

          {/* Confirm Account Number */}
          <div>
            <label
              htmlFor="confirmAccountNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="confirmAccountNumber"
              name="confirmAccountNumber"
              value={formData.confirmAccountNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={18}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.confirmAccountNumber && touched.confirmAccountNumber
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="Re-enter account number"
            />
            {errors.confirmAccountNumber && touched.confirmAccountNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmAccountNumber}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              maxLength={11}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.ifscCode && touched.ifscCode
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="SBIN0123456"
            />
            {errors.ifscCode && touched.ifscCode && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.ifscCode}
              </p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
              placeholder="e.g., State Bank of India"
            />
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Your bank details are securely stored and only used for payouts.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving Bank Details...
              </div>
            ) : (
              "Save Bank Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBankDetailsPage;
