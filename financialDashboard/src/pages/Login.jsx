import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios'
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  useEffect(()=>{
    setTimeout(()=>{
      setMessage('');
    },1000)
  },[message]);

  const onSubmit = (data) => {
    console.log(`${API_URL}`);
    if (isLogin) {
      console.log("Login Data:", data);
      alert("Logged in successfully");
    } else {
      axios.post(`${API_URL}/api/register`,data)
      .then((result)=>{setMessage("Registration Successful");setInterval(()=>{setIsLogin(true)},1000)})
      .catch((error) => {
        setIsLogin(false);
        if(error.response.data.error.includes('E11000')){
          setIsError(true);
          setMessage("User already exists")
          if(window.confirm('User already exists'))
            reset();
        }
      });  
    }
    reset();
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
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Welcome" : "Create Account"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Login to continue managing your finances"
                : "Start managing your finances today"}
            </p>
          </div>

          {message && message !== '' && <div className={`p-4 mb-4 text-sm rounded-base ${isError ? "text-fg-danger-strong bg-danger-soft" : "text-fg-success-strong bg-success-soft"}`} role="alert"><p className="font-medium">{message}</p></div>}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Email
              </label>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Password
              </label>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (only for Register) */}
            {!isLogin && (
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
                      value === password || "Passwords do not match",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* Footer Toggle */}
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
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
