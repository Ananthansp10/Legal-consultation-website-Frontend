import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/user/authService";
import { useApi } from "../../hooks/UseApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const { data, error, loading, execute } = useApi(forgotPassword);

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailValue.trim()) {
      setEmailError("Email is required");
      return false;
    }

    if (!emailRegex.test(emailValue.trim())) {
      setEmailError("Invalid email format");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return;
    }

    await execute(email);
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const responseData = { ...data.data, forgotPassword: true };
      localStorage.setItem("userDetails", JSON.stringify(responseData));
      toast.success(data.message);
      navigate("/auth/otp-verification");
    }
  }, [data]);

  return (
    <div className="min-h-screen flex">
      {/* Back to Home Button */}
      <Link
        to="/user"
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-slate-600 hover:text-blue-500 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Legal books and courthouse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-xl opacity-90">
              We'll help you get back into your account securely
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Forgot your password?
              </h1>
              <p className="text-slate-600">
                Enter your email or phone number and we'll send you a password
                reset link or OTP.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/80 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      emailError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/auth/signin"
                className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Remembered your password? Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
