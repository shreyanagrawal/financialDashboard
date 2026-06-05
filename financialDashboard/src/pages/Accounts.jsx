import axios from "axios";
import { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import { getAccountsData } from "../utils/api";
import { useContext } from "react";
import { PlaidContext } from "../utils/PlaidContext";
import PlaidStats from "../components/PlaidStats";
import {
  RefreshCw,
  Activity,
  Landmark,
  BarChart3,
  Receipt,
  UserCheck,
  ArrowDownToLine,
  Network,
  Shield,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
const Accounts = (userId) => {
  const [loading, setLoading] = useState(true);
  const {accounts, setAccounts} = useContext(PlaidContext);
  useEffect(() => {
    if(accounts.length === 0)
      loadAccounts();
  }, []);
  useEffect(() => {
    if (accounts) {
      setLoading(false);
    }
  }, [accounts]);
  const loadAccounts = async()=>{
    const accounstData = await getAccountsData(userId.userId);
    setAccounts(accounstData);
  }
  if (loading) return <h1>Loading..</h1>;

  return ( 
    <div className="p-5">
      {accounts && accounts.length > 0 && (
        <PlaidStats />
      )}
      <div className="rounded-2xl">
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
          <h2 className="text-3xl font-bold ">Bank Accounts</h2>
          {/* <button className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg">Connect Bank via Plaid</button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {accounts && accounts.length > 0 ? (
            <div className="space-y-4">
              {accounts.flatMap(item =>
                item.accounts.map(account => (
                  <AccountCard
                    key={account.accountId}
                    account={account}
                  />
                ))
              )}
           </div>
         ) : (
             <div className="bg-white rounded-2xl shadow-md  p-10 max-w-5xl mx-auto text-center">
              <div className="flex justify-center mb-6">
              <Landmark className="w-16 h-16 text-blue-600" />
              </div>
                 <h3 className="text-2xl font-bold mb-3">
                   No bank account connected
                 </h3>

                 <p className="text-gray-500 mb-6">
                  Connect a bank account through Plaid to start tracking balances, transactions and account details automatically.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                         <RefreshCw className="w-8 h-8 text-blue-600 mb-2" />
                         <h4 className="font-semibold text-blue-700">
                             Account Synchronization
                         </h4>
                          <p className="text-sm text-gray-600">
                             Automatically keep linked accounts updated with the latest information.
                           </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                          <UserCheck className="w-8 h-8 text-green-600 mb-2" />
                          <h4 className="font-semibold text-green-700">
                             Account Verification
                           </h4>
                           <p className="text-sm text-gray-600">
                               Securely verify ownership before accessing account data.
                           </p>
                       </div>
                       <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                         <ArrowDownToLine className="w-8 h-8 text-purple-600 mb-2" />
                         <h4 className="font-semibold text-purple-700">
                            Transaction Import
                         </h4>
                         <p className="text-sm text-gray-600">
                             Import and organize transactions directly from your connected bank.
                         </p>
                       </div>

                       <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                         <Network className="w-8 h-8 text-yellow-600 mb-2" />
                         <h4 className="font-semibold text-yellow-700">
                            Multi-Bank Management
                         </h4>
                         <p className="text-sm text-gray-600">
                              Manage multiple financial institutions from a single dashboard.
                          </p>
                       </div>
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Activity className="w-4 h-4" />
                      Account data will appear here once a bank connection is established.
                  </div>
              </div>
            )
         }
        </div>
      </div>
    </div>
  );
};
                  
export default Accounts;
