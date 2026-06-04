import axios from "axios";
import { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import { getAccountsData } from "../utils/api";
import { useContext } from "react";
import { PlaidContext } from "../utils/PlaidContext";
import PlaidStats from "../components/PlaidStats";
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
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Accounts</h1>
      <PlaidStats />
      <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Bank Accounts</h2>
          <button className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg">Connect Bank via Plaid</button>
        </div>
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
      </div>
    </div>
  );
};

export default Accounts;
