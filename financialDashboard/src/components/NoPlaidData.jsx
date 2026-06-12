import {
    Landmark,
    Wallet,
    BarChart3,
    Shield,
} from "lucide-react";

const NoPlaidData = ({ open, ready }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 md:p-10">
      <div className="flex flex-col items-center text-centre">
        <Landmark className="w-14 h-14 text-blue-600" />
      

       <h2 className="text-2xl font-bold mb-3 text-center md:text-left">
          No Bank Account Connected
       </h2>

       <p className="text-gray-500 text-centre max-w-4xl mx-auto mb-8 text-center md:text-left">
          Connect a bank account through Plaid to view balances,
            transactions, analytics and financial insights.
       </p>
      </div>
      <h3 className="text-lg font-semibold text-center mb-6">
         Why Connect Your Bank Account?
     </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
           <Wallet className="w-8 h-8 text-blue-600 mb-2" />
           <h3 className="font-semibold text-blue-700">
             Complete Financial View
           </h3>
           <p className="text-sm text-gray-600 mt-1">
             View all connected accounts and balances in one dashboard.
          </p>
       </div>
       <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <BarChart3 className="w-8 h-8 text-green-600 mb-2" /> 
          <h3 className="font-semibold text-green-700">
             Transaction Tracking
          </h3>
          <p className="text-sm text-gray-600 mt-1">
             Monitor spending, income and account activity automatically.
          </p>
       </div>
       <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <Shield className="w-8 h-8 text-purple-600 mb-2" /> 
          <h3 className="font-semibold text-purple-700">
             Bank-Grade Security
          </h3>
          <p className="text-sm text-gray-600 mt-1">
             Secure connections powered by Plaid and encrypted data handling.
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
          <Landmark className="w-8 h-8 text-yellow-600 mb-2" /> 
          <h3 className="font-semibold text-yellow-700">
            Smarter Decisions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Gain insights into financial habits and spending trends.
          </p>
       </div>
     </div>
     <div className="mt-10 border-t pt-8">
       <h3 className="text-xl font-bold text-center mb-6">
         How It Works
       </h3>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
         <div>
           <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              1
           </div>
           <p className="mt-2 font-medium">Connect Bank</p>
           <p className="text-xs text-gray-500 mt-1">
              Securely link your account.
           </p>
       </div>

        <div>
          <div className="w-10 h-10 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
             2
          </div>
          <p className="mt-2 font-medium">Sync Data</p>
          <p className="text-xs text-gray-500 mt-1">
              Import balances and transactions.
          </p>
        </div>

        <div>
          <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
             3
          </div>
          <p className="mt-2 font-medium">Analyze Spending</p>
          <p className="text-xs text-gray-500 mt-1">
             View insights and trends.
          </p>
        </div>

        <div>
          <div className="w-10 h-10 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
              4
          </div>
          <p className="mt-2 font-medium">Track Growth</p>
          <p className="text-xs text-gray-500 mt-1">
             Monitor your financial health.
          </p>
        </div>
     </div>
     {/* TRUST SECTION */}
     
     <div className="mt-10 border-t pt-8">
      <h3 className="text-xl font-bold text-center mb-6">
         Trusted & Secure
      </h3>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center border">
             <div className="text-2xl mb-2">🛡️</div>
             <h4 className="font-semibold text-gray-800">
                Trusted by Millions
             </h4>
             <p className="text-xs text-gray-500 mt-1">
                Secure connections with financial institutions.
             </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-center border">
             <div className="text-2xl mb-2">🏦</div>
               <h4 className="font-semibold text-gray-800">
                 10,000+
               </h4>
               <p className="text-xs text-gray-500 mt-1">
                 Financial institutions supported.
               </p>
           </div>

           <div className="bg-gray-50 rounded-xl p-4 text-center border">
             <div className="text-2xl mb-2">👥</div>
               <h4 className="font-semibold text-gray-800">
                   100M+
               </h4>
               <p className="text-xs text-gray-500 mt-1">
                  Users connected worldwide.
               </p>
           </div>

           <div className="bg-gray-50 rounded-xl p-4 text-center border">
              <div className="text-2xl mb-2">🔒</div>
               <h4 className="font-semibold text-gray-800">
                 Bank-Level Security
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                 Encrypted and protected data handling.
              </p>
          </div>

         </div>
     </div>
   </div>
  </div>
   );
};

export default NoPlaidData;