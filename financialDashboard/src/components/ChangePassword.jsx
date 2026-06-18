import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;
const ChangePasswordModal = ({ isOpen, onClose, userId }) => {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { loading, setLoading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const newPassword = watch("newPassword");
  const handleModalClose = () => {
    setMessage("");
    setIsError(false);
    reset(); // Clears the form fields
    onClose();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/update-password`, {
        userId: userId,
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword,
      });
      setIsError(false);
      setMessage("Password updated successfully!");
      setTimeout(() => {
        handleModalClose();
      }, 2000);
      
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
        >
          &times;
        </button>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please enter your current password to create a new one.
          </p>
        </div>
        {message && !isError && (
          <div className="text-green-700 bg-green-50 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 font-medium border border-green-200">
            <span>✓</span> {message}
          </div>
        )}
        {message && isError && (
          <div className="text-red-700 bg-red-50 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 font-medium border border-red-200">
            <span>⚠</span> {message}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block mb-1 text-gray-700 text-sm font-medium">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === newPassword || "Passwords do not match",
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 font-semibold py-2.5 rounded-lg transition duration-200 shadow-sm"
          >
            {loading ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;