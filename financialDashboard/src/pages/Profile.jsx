import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import {
  User,
  Mail,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const Profile = () => {
  const { userData } = useContext(AuthContext);

  const username = userData?.email
    ? userData.email.split("@")[0]
    : "User";

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
         Profile Settings
      </h1>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
            {username[0]?.toUpperCase()}
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            {username}
          </h2>

           
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"></div>
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
             Account Information
          </h3>

          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600" />
                <div>
                   <p className="text-sm text-gray-500">Email</p>
                   <p>{userData?.email}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <User size={18} className="text-blue-600" />
             <div>
                 <p className="text-sm text-gray-500">User ID</p>
                 <p className="font-mono text-sm break-all">{userData?._id}</p>
              </div>
          </div>

         <div className="flex items-center gap-3">
            <BadgeCheck size={18} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>Active</p>
           </div>
         </div>

        </div>
        
   </div>
   <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">
         Security
      </h3>

      <div className="space-y-4">
       <div className="flex items-center gap-3">
         <ShieldCheck size={18} className="text-green-600" />
           <span>Secure Authentication</span>
      </div>

      <div className="flex items-center gap-3">
         <ShieldCheck size={18} className="text-green-600" />
           <span>Encrypted Data Storage</span>
       </div>

       <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-green-600" />
            <span>Protected Banking Access</span>
       </div>

    </div>
   </div>
         
  </div>
  </div>
  );
};

export default Profile;