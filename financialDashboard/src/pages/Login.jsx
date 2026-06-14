import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import ForgotPasswordModal from "./ForgotPassword"; // Ensure this matches your modal file path

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // Modal control state
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [isOtpStep, setIsOtpStep] = useState(false);      
  const [registrationData, setRegistrationData] = useState(null); 
  const [otp, setOtp] = useState("");                     
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");

  useEffect(() => {
    if (message !== '' && isError) {
      const interval = setInterval(() => {
        setMessage("");
      }, 1000);
      return () => clearInterval(interval); // Fixed: Properly clearing interval on unmount
    }
  }, [isError, message]);

  const onSubmit = (data) => {
    if (isLogin) {
      axios.post(`${API_URL}/api/login`, data, {
        withCredentials: true
      })
      .then(async (result) => {
        setIsError(false);
        const token = result.data.accessToken;
        setAccessToken(result.data.accessToken);
        setMessage("User logged in successfully");
        
        const profileData = await axios.get(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        if (profileData.status === 200) {
          setTimeout(() => { navigate("/home"); }, 2000);
        }
        reset();
      })
      .catch((error) => {
        setIsError(true);
        setMessage(error.response?.data?.message || "Login Failed");
      });
    } else {
      setLoading(true);
    axios.post(`${API_URL}/api/sendRegistrationOTP`, { email: data.email })
      .then((result) => {
        setIsError(false);
        setMessage(result.data.message || "OTP sent to your email!");
        setRegistrationData(data); // Stash email/password into temporary state
        setIsOtpStep(true);        // Advance UI layout to the OTP screen
      })
      .catch((error) => {
        setIsError(true);
        setMessage(error.response?.data?.message || "Failed to send verification email");
      })
      .finally(() => setLoading(false));
  }
  // Remove the standalone reset(); call from the very bottom of onSubmit 
  // so it doesn't wipe your fields before the user can type their OTP.
    
  };

  const handleVerifyRegister = (e) => {
  e.preventDefault();
  if (otp.length !== 6) {
    setIsError(true);
    setMessage("Please enter a valid 6-digit code");
    return;
  }

  setLoading(true);
  axios.post(`${API_URL}/api/registerWithOTP`, {
    email: registrationData.email,
    password: registrationData.password,
    otp: otp
  })
  .then((result) => {
    setIsError(false);
    setMessage("Registration Successful!");
    const registeredEmail = registrationData.email;
    setTimeout(() => {
      setIsOtpStep(false);
      setIsLogin(true); // Direct user to login view
      setOtp("");
      reset();          // Now safe to clear React Hook Form
      setValue("email", registeredEmail);
      setMessage("");
    }, 2000);
  })
  .catch((error) => {
    setIsError(true);
    setMessage(error.response?.data?.message || "Invalid or expired OTP");
  })
  .finally(() => setLoading(false));
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 md:flex-row relative">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-4/5 bg-gradient-to-br from-blue-800 to-blue-500 text-white p-12 flex-col justify-center rounded-r-4xl">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Personal Finance
          <br />
          <span className="text-5xl text-white-700 leading-8 mb-8">Management Dashboard</span>
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
          {/* Dynamic Headings based on state */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {isOtpStep ? "Verify Your Email" : isLogin ? "Welcome" : "Create Account"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isOtpStep
                ? `Enter the 6-digit verification OTP sent to ${registrationData?.email}`
                : isLogin
                ? "Login to continue managing your finances"
                : "Start managing your finances today"}
            </p>
          </div>

          {message && message !== '' && (
            <div className={`p-4 mb-4 text-sm rounded-lg ${isError ? "text-red-700 bg-red-100 border border-red-300" : "text-green-700 bg-green-100 border border-green-300"}`} role="alert">
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Conditional Layout Switching */}
          {isOtpStep ? (
            /* STEP 2: REGISTRATION OTP CODES VERIFICATION INTERFACE */
            <form onSubmit={handleVerifyRegister} className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Verification Code</label>
                <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                 Sent a 6-digit code to: <strong className="text-blue-700 block mt-0.5 break-all">{registrationData?.email}</strong>
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200"
              >
                {loading ? "Verifying..." : "Complete Registration"}
              </button>

              <button 
                type="button" 
                onClick={() => setIsOtpStep(false)} 
                className="w-full text-gray-500 hover:underline text-sm font-medium text-center block"
              >
                Back to form
              </button>
            </form>
          ) : (
            /* STEP 1: GENERAL LOGIN / SIGN UP DATA FORM FIELDS */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Email </label>
                <input
                  type="email"
                  placeholder="Enter your email"
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
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Create password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
                
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button 
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)} 
                      className="text-blue-600 hover:underline text-sm font-medium focus:outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition duration-200"
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Register"}
              </button>
            </form>
          )}

          {/* Hide switch login/signup links if user is validating the OTP */}
          {!isOtpStep && (
            <p className="text-center text-gray-500 mt-6 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password Modal Injection */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </div>
  );
}
export default Login;