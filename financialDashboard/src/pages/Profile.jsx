import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { PlaidContext } from '../utils/PlaidContext';
import ForgotPasswordModel from '../components/ForgotPassword';

const Profile = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const { accounts, transactions } = useContext(PlaidContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [backupName, setBackupName] = useState(""); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  let displayName = userData?.name;
  if (!displayName && userData?.email) {
    let extracted = userData.email.split('@')[0];
    extracted = extracted.replace(/[0-9._]/g, ' ').trim();
    extracted = extracted.replace(/\s+/g, ' ');

    if (extracted.length > 0) {
      displayName = extracted.replace(/\b\w/g, char => char.toUpperCase());
    } else {
      displayName = "Dashboard User";
    }
  } else if (!displayName) {
    displayName = "Dashboard User";
  }
  const startEditing = () => {
    setEditName(displayName);
    setBackupName(displayName); 
    setIsEditing(true);
  };
  const handleTyping = (e) => {
    const newValue = e.target.value;
    setEditName(newValue);
    setUserData({ ...userData, name: newValue });
  };
  const handleCancel = () => {
    setUserData({ ...userData, name: backupName });
    setIsEditing(false);
  };
  const handleSave = async () => {
    try {
      setIsEditing(false);
      // NOTE: Call your backend API here to save the new name permanently to your database
      // await axios.put(`${API_URL}/api/user/update`, { name: editName, userId: userData._id });
    } catch (error) {
      console.log("Error updating profile", error);
    }
  };

  const totalConnectedBanks = accounts?.length || 0;
  const totalAccounts = accounts?.reduce((total, bank) => total + bank.accounts.length, 0) || 0;
  const totalTransactions = transactions?.length || 0;

  const memberSince = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : "Recently joined";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-blue-200 mt-1">{userData?.email}</p>
          <span className="inline-block mt-3 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Member since {memberSince}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName}
                    onChange={handleTyping} // Triggers the live update
                    className="mt-1 w-full p-3 bg-white border-2 border-blue-400 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Enter your name"
                    autoFocus
                  />
                ) : (
                  <div className="mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-medium">
                    {displayName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700">
                  {userData?.email || "Not provided"}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Account ID</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 font-mono text-sm break-all">
                  {userData?._id || "N/A"}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel} 
                    className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={startEditing} 
                  className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Plaid Connections</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <span className="font-medium text-blue-900">Banks</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{totalConnectedBanks}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <span className="font-medium text-green-900">Accounts</span>
                </div>
                <span className="text-xl font-bold text-green-700">{totalAccounts}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧾</span>
                  <span className="font-medium text-purple-900">Transactions</span>
                </div>
                <span className="text-xl font-bold text-purple-700">{totalTransactions}</span>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Security</h2>
            <p className="text-sm text-gray-500 mb-4">Your connection to Plaid is secure. We do not store your banking credentials.</p>
            <button 
              onClick={() => setIsPasswordModalOpen(true)} 
              className="w-full px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
              >
              Change Password
            </button>
          </div>
        </div>

      </div>
      <ForgotPasswordModel 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        isProfileMode={true} 
        userId={userData?._id}
      />
    </div>
  );
};

export default Profile;