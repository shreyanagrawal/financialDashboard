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
      <PlaidStats />
      <div className="rounded-2xl">
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
          <h2 className="text-3xl font-bold ">Bank Accounts</h2>
          {/* <button className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg">Connect Bank via Plaid</button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {accounts?.flatMap(item =>
              item.accounts.map(account => (
                <AccountCard
                  key={account.accountId}
                  account={account}
                  userId={userId.userId}
                />
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
