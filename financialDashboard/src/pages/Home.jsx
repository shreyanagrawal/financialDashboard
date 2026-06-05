import { useContext, useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import { PlaidContext } from "../utils/PlaidContext";
import { AuthContext } from "../utils/AuthContext";
import { getAccountsData } from "../utils/api";
import { getTransactionsData } from "../utils/api";
import PlaidStats from "../components/PlaidStats";
import {
  Wallet,
  Shield,
  BarChart3,
  Landmark
} from "lucide-react";
const Home = () => {
  const {accounts,setAccounts} = useContext(PlaidContext);
  const {userData,setUserData} = useContext(AuthContext);
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);
  useEffect(() => {
    setLoading(false);
  }, [transactions]);
  const loadAccounts = async()=>{
    const accounstData = await getAccountsData(userData._id);
    setAccounts(accounstData);
  }
  const loadTransactions = async()=>{
    const transactionsData = await getTransactionsData(userData._id);
    const transactions = transactionsData.flatMap(item => item.transactions);
    setTransactions(transactions);
  }
  if(loading) return <h1>Loading...</h1>
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-8">
         
        {accounts && accounts.length > 0 && (
          <PlaidStats transactions={transactions} />
        )}
        {accounts && accounts.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-500">
              Transactions and analytics will appear here once a bank account is connected.
            </p>
          </div>
        )}
        <div className="mt-2">
          {accounts && accounts.length > 0 ? (
  
            <div className="space-y-4">
              {accounts?.flatMap(item =>
                item.accounts.map(account => (
                    <AccountCard
                    key={account.accountId}
                    account={account}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-10 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
               <Shield className="w-4 h-4" />
                Secure • Fast • Trusted
              </div>
              <h2 className="text-2xl font-bold mb-3">
                 Connect your first bank account
              </h2>

              <p className="text-gray-500 mb-6">
                 Securely connect your bank through Plaid and unlock powerful financial insights.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-blue-50 rounded-xl p-4">
                 <Wallet className="w-8 h-8 text-blue-600 mb-2" />
                   <h3 className="font-semibold text-blue-700">
                     Real-time Balances
                   </h3>
                 <p className="text-sm text-gray-600 mt-1">
                   Track account balances automatically.
                 </p>
               </div>
    
               <div className="bg-green-50 rounded-xl p-4">
                 <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                   <h3 className="font-semibold text-green-700">
                     Transaction Tracking
                   </h3>
                 <p className="text-sm text-gray-600 mt-1">
                    Monitor spending and income activity.
                 </p>
               </div>

               <div className="bg-purple-50 rounded-xl p-4">
                 <Shield className="w-8 h-8 text-purple-600 mb-2" />
                 <h3 className="font-semibold text-purple-700">
                   Secure Connection
                 </h3>
                 <p className="text-sm text-gray-600 mt-1">
                    Bank-level encryption powered by Plaid.
                 </p>
               </div>

               <div className="bg-yellow-50 rounded-xl p-4">
                 <Landmark className="w-8 h-8 text-yellow-600 mb-2" />
                 <h3 className="font-semibold text-yellow-700">
                      Better Insights
                 </h3>
                 <p className="text-sm text-gray-600 mt-1">
                   Understand spending habits and trends.
                 </p>
               </div>
              </div>
              <div className="mt-8">
               <h3 className="text-xl font-bold text-center mb-6">
                  How It Works
               </h3>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                 <div className="hidden md:block absolute top-5 left-[15%] w-[70%] h-0.5 bg-gray-300"></div>
                 <div className="text-center relative z-10">
                   <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                   </div>
                   <p className="mt-2 font-medium">
                        Connect Bank
                    </p>
                  </div>

                  <div className="text-center relative z-10">
                     <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Landmark className="w-5 h-5" />
                     </div>
                     <p className="mt-2 font-medium">
                       Sync Accounts
                     </p>
                   </div>

                   <div className="text-center relative z-10">
                     <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                     </div>
                     <p className="mt-2 font-medium">
                       Track Spending
                     </p>
                   </div>

                   <div className="text-center relative z-10">
                     <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                     </div>
                     <p className="mt-2 font-medium">
                       View Insights
                     </p>
                   </div>
                 </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

               <div className="bg-gray-50 rounded-xl p-4 text-center">
                 <p className="text-2xl font-bold text-blue-600">24/7</p>
                 <p className="text-sm text-gray-500">Monitoring</p>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                 <p className="text-sm text-gray-500">Encrypted</p>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 text-center">
                 <p className="text-2xl font-bold text-purple-600">1+</p>
                 <p className="text-sm text-gray-500">Banks Supported</p>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">Secure</p>
                  <p className="text-sm text-gray-500">Plaid Connection</p>
               </div>
              </div>
            </div>
          
          )}
        </div>
     </div>
   </div>
  );
};
export default Home;