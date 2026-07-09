import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import ChangePasswordModal from "../components/ChangePassword"; 
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const {accessToken,setAccessToken} = useContext(AuthContext);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [regStep, setRegStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const password = watch("password");

  useEffect(()=>{
    if(message !== '' && isError){
      const interval = setInterval(()=>{
        setMessage("");
      },3000)
      return clearInterval(setInterval);
    }
  },[isError,message])

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    if (isLogin) {
      try{
        const result = await axios.post(`/api/login`,data,{
        withCredentials:true })
        setIsError(false);
        const token = result.data.accessToken;
        setAccessToken(token);
        setMessage("User logged in successfully");
        const profileData = await axios.get(`/api/profile`,{
            headers:{
                Authorization:
                  `Bearer ${token}`
            },
            withCredentials:true
          })
          if(profileData.status === 200)
            setTimeout(()=>{navigate("/home")},2000);
      }catch(error){
        setIsError(true);
        setMessage(error.response?.data?.message || "Login Failed");
        setIsSubmitting(false);
      }
      }else{
        if (regStep === 1) {
          try{
            await axios.post(`/api/sendRegistrationOTP`, { email: data.email });
            setIsError(false);
            setMessage("OTP sent to your email. Please verify.");
            setRegStep(2); 
          }catch(error){
            setIsError(true);
            setMessage(error.response?.data?.message || "Failed to send OTP");
          }finally{
            setIsSubmitting(false);
        }
      } 
      else if (regStep === 2) {
        if (!otp || otp.length !== 6) {
          setIsError(true);
          setMessage("Please enter a valid 6-digit OTP");
          setIsSubmitting(false);
          return;
        }
        try {
          const payload = { ...data, otp: otp };
          await axios.post(`/api/registerWithOTP`, payload);
          setIsError(false);
          setMessage("Registration Successful!");
          setTimeout(() => {
            setIsLogin(true);
            setRegStep(1); // Reset step back to 1
            setOtp("");
            reset();
          }, 2000);
        } catch (error) {
          setIsError(true);
          setMessage(error.response?.data?.message || "Registration failed. Invalid OTP.");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  }
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setRegStep(1);
    setOtp("");
    setMessage("");
    reset();
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 md:flex-row">
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
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Welcome" : (regStep === 1 ? "Create Account" : "Verify Email")}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Login to continue managing your finances"
                : (regStep === 1 ? "Start managing your finances today" : "Enter the 6-digit OTP sent to your email")}
            </p>
          </div>
          {message && message !== '' && <div className={`p-4 mb-4 text-sm rounded-base ${isError ? "text-fg-danger-strong bg-danger-soft" : "text-fg-success-strong bg-success-soft"}`} role="alert"><p className="font-medium">{message}</p></div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {(isLogin || regStep === 1) && (
            <>
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

              {/* 3. ADDED THE "FORGOT PASSWORD" TRIGGER UNDER THE PASSWORD FIELD */}
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
            {!isLogin && regStep === 1 &&(
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            )}
            </>
            )}
            {!isLogin && regStep === 2 && (
  <div className="animate-in fade-in duration-300">
    <label className="block mb-2 text-gray-700 font-medium">Verification Code (OTP)</label>
    <input
      type="text"
      placeholder="Enter 6-digit OTP"
      maxLength="6"
      value={otp}
      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg"
      autoFocus
    />
    <button 
      type="button" 
      onClick={() => setRegStep(1)} 
      className="text-sm text-blue-600 hover:underline mt-3 block w-full text-center"
    >
      Entered wrong email? Go back
    </button>
  </div>
)}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              {isSubmitting
                ? "Processing..."
                : (isLogin ? "Login" : (regStep === 1 ? "Send OTP" : "Verify & Register"))}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:underline font-medium"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>

      {/* 4. MODAL ELEMENT MOUNTED HERE AT THE BASE LEVEL OF RETURN BLOCK */}
      <ChangePasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </div>
  );
};
export default Login;