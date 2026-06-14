import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Added standard modal control props: isOpen and onClose
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  // Reset local state variables when closing the modal
  const handleModalClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setMessage("");
    setIsError(false);
    reset();
    onClose();
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/sendOTP`, {
        email: data.email,
      });
      setEmail(data.email);
      setIsError(false);
      setMessage("OTP sent successfully to your email");
      setTimeout(() => {
        setStep(2);
        setMessage("");
      }, 1500);
      reset();
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/verifyotp`, {
        email: email,
        otp: otp,
      });
      setIsError(false);
      setMessage("OTP verified successfully");
      setTimeout(() => {
        setStep(3);
        setMessage("");
      }, 1500);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/changepassword`, {
        email: email,
        otp: otp,
        newPassword: data.newPassword,
      });
      setIsError(false);
      setMessage("Password reset successfully!");
      setTimeout(() => {
        handleModalClose(); // Automatically closes the modal on completion
      }, 2000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleModalClose} // Closes modal if clicking backdrop outside
    >
      {/* Modal Card Content Container */}
      <div 
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside the card
      >
        {/* Close "X" Button top right */}
        <button 
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2 text-sm">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className={`flex-1 h-2 rounded-full mr-2 ${step >= 1 ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full mr-2 ${step >= 2 ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-gray-300"}`}></div>
        </div>

        {/* Status Message System */}
        {message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${isError ? "text-red-700 bg-red-100 border border-red-300" : "text-green-700 bg-green-100 border border-green-300"}`} role="alert">
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 text-sm font-medium">Enter OTP</label>
              <p className="text-xs text-gray-600 mb-2">Sent a 6-digit code to <strong>{email}</strong></p>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" onClick={() => { setStep(1); setOtp(""); setMessage(""); }} className="w-full text-blue-600 text-sm font-semibold py-1 hover:underline">
              Back to Email
            </button>
          </form>
        )}

        {/* Step 3: Reset Password Form */}
        {step === 3 && (
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 text-sm font-medium">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-gray-700 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === newPassword || "Passwords do not match",
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;