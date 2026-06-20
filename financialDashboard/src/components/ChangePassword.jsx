import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import { logoutUser } from "../utils/api";
const API_URL = import.meta.env.VITE_API_URL;

const ChangePasswordModal = ({ isOpen, onClose, isProfileMode, userId }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (isOpen) {
      if (isProfileMode) {
        setStep(3);
      } else {
        setStep(1);
      }
    }
  }, [isOpen, isProfileMode]);

  const handleModalClose = () => {
    setStep(isProfileMode ? 3 : 1);
    setEmail("");
    setOtp("");
    setOtpVerified(false);
    setMessage("");
    setIsError(false);
    reset();
    onClose();
  };

  // Step 1: Send OTP
  const handleSendOTP = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/sendOTP`, { email: data.email });
      setEmail(data.email);
      setIsError(false);
      setMessage("OTP has been sent to your email");
      setStep(2); 
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setTimeout(()=>{setIsSubmitting(false)
      },1000);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setIsError(true);
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/verifyotp`, { email, otp });
      setIsError(false);
      setOtpVerified(true);
      setMessage("OTP verified successfully");
      
      // Delay slightly to match the transition to password fields
      setTimeout(() => {
        setStep(3);
      }, 1000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Invalid OTP");
    } finally {
      setTimeout(()=>{setIsSubmitting(false)
      },1000);
    }
  };

  // Step 3: Final Password Reset Submit
  const handleResetPassword = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = isProfileMode
        ? {
            userId: userId, 
            currentPassword: data.currentPassword, // From the Profile page
            newPassword: data.newPassword,
          }
        : {
            email: email, 
            otp: otp,                              // From the Login page
            newPassword: data.newPassword,
          };
      await axios.post(`${API_URL}/api/changepassword`, payload);
      setIsError(false);
      setMessage(isProfileMode ? "Password updated successfully!" : "Password reset successfully!");
      setTimeout(() => {
        handleModalClose();
      }, 2000);
      setTimeout(()=>{
        logoutUser();
      },100)
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Failed to reset password");
    } finally {
      setTimeout(()=>{setIsSubmitting(false)
      },1000);    
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {isProfileMode ? "Change Password" : "Forgot Password"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
           {isProfileMode 
              ? "Enter your current password to create a new one."
              : "Enter your email address and we'll send you an OTP to reset your password."}
          </p>
        </div>

        {/* Global Status/Success Messages under input sections */}
        {message && !isError && (
          <div className="text-green-600 text-sm mb-4 flex items-center gap-1 font-medium">
            <span>✓</span> {message}
          </div>
        )}
        {message && isError && (
          <div className="text-red-600 text-sm mb-4 flex items-center gap-1 font-medium">
            <span>⚠</span> {message}
          </div>
        )}

        {/* --- Dynamic Forms Block --- */}
        
        {/* 1. Email Field Section (Stays visible throughout all steps) */}
        <form onSubmit={handleSubmit(step === 1 ? handleSendOTP : handleResetPassword)} className="space-y-4">
          {step === 1 && !isProfileMode && (
          <div>
            <label className="block mb-1 text-gray-700 text-sm font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                disabled={step > 1}
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                })}
                className={`w-full border rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  step > 1 ? "bg-gray-50 text-gray-500 border-green-500" : "border-gray-300"
                }`}
              />
              {step > 1 && (
                <span className="absolute right-3 top-3 text-green-500 font-bold">✓</span>
              )}
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          )}

          {/* 2. OTP Field Section (Appears sequentially during Step 2 & 3) */}
          {step >= 2 && !isProfileMode &&(
            <div className="animate-in fade-in duration-300">
              <label className="block mb-1 text-gray-700 text-sm font-medium">OTP</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  disabled={otpVerified}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={`w-full border rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpVerified ? "bg-gray-50 text-gray-500 border-green-500" : "border-gray-300"
                  }`}
                />
                {otpVerified && (
                  <span className="absolute right-3 top-3 text-green-500 font-bold">✓</span>
                )}
              </div>
            </div>
          )}

          {/* 3. Password Creation Section (Appears during Step 3) */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {isProfileMode && (
                <div>
                  <label className="block mb-1 text-gray-700 text-sm font-medium">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                </div>
              )}
              <div>
                <label className="block mb-1 text-gray-700 text-sm font-medium">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block mb-1 text-gray-700 text-sm font-medium">Confrm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === newPassword || "Passwords do not match",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
              </div>
          )}

          {/* --- Context-Aware Action Button --- */}
          {step === 1 && !isProfileMode &&(
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          )}
        </form>

        {/* Separated handler execution form for Step 2 to bypass React Hook Form rules cleanly */}
        {step === 2 && !isProfileMode &&(
          <button 
            type="button"
            onClick={handleVerifyOTP}
            disabled={isSubmitting || otp.length !== 6} 
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 font-semibold py-2.5 rounded-lg transition duration-200"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        )}

        {step === 3 && (
          <button 
            type="button"
            onClick={handleSubmit(handleResetPassword)}
            disabled={isSubmitting} 
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 font-semibold py-2.5 rounded-lg transition duration-200"
          >
            {isSubmitting ? "Saving..." : (isProfileMode ? "Update Password" : "Reset Password")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;