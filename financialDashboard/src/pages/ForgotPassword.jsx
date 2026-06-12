import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  // Step 1: Send OTP to email
  const handleSendOTP = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/sendOTP`, {
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
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 md:flex-row">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-4/5 bg-gradient-to-br from-blue-800 to-blue-500 text-white p-12 flex-col justify-center rounded-r-4xl">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Personal Finance
          <br />
          <span className="text-5xl text-white-700 leading-8 mb-8">
            Management Dashboard
          </span>
        </h1>
        <p className="text-lg text-blue-100 leading-8 mb-8">
          Take full control of your financial life with one smart dashboard.
          Track expenses, monitor income, manage budgets, and visualize your
          spending habits — all in one secure place.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <p>Track bank transactions easily</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <p>Visualize spending analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <p>Create smart monthly budgets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <p>Monitor your financial growth</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-6 py-10">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 mt-2">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create your new password"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 flex justify-between items-center">
            <div
              className={`flex-1 h-2 rounded-full mr-2 ${
                step >= 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full mr-2 ${
                step >= 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full ${
                step >= 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
          </div>

          {/* Message */}
          {message && message !== "" && (
            <div
              className={`p-4 mb-4 text-sm rounded-lg ${
                isError
                  ? "text-red-700 bg-red-100 border border-red-300"
                  : "text-green-700 bg-green-100 border border-green-300"
              }`}
              role="alert"
            >
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-blue-600 font-semibold py-2 hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Enter OTP
                </label>
                <p className="text-sm text-gray-600 mb-3">
                Sent a 6-digit code to <strong>{email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setMessage("");
                }}
                className="w-full text-blue-600 font-semibold py-2 hover:underline"
              >
                Back to Email
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-blue-600 font-semibold py-2 hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
