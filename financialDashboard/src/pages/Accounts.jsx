import axios from "axios";
import { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";

const API_URL = import.meta.env.VITE_API_URL;

const Accounts = (userId) => {
const [loading, setLoading] = useState(true);
const [accounts, setAccounts] = useState(null);

const totalBalance =
accounts?.reduce(
(sum, account) => sum + (account.balances?.current || 0),
0
) || 0;

useEffect(() => {
getAccountsData();
}, []);

const getAccountsData = async () => {
try {
const accountsData = await axios.post(
`${API_URL}/api/getAccounts`,
{ userid: userId.userId }
);


  if (accountsData.status === 200) {
    setAccounts(accountsData.data.accounts[0].accounts);
  }
} catch (err) {
  console.log(err);
}


};

useEffect(() => {
if (accounts) {
setLoading(false);
}
}, [accounts]);

if (loading) return <h1>Loading..</h1>;

return ( <div className="p-5 bg-[#081327]">


  <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
    Accounts
  </h1>

  <div className="grid md:grid-cols-3 gap-4 mb-6">

    <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
      <p className="text-slate-400">Total Balance</p>

      <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
         ${totalBalance}
      </h2>

      <p className="text-green-400 mt-2">
        Across {accounts.length} accounts
      </p>
    </div>

    <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
      <p className="text-slate-400">
        Connected Banks
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
         {accounts.length}
      </h2>

      <p className="text-slate-400 mt-2">
        via Plaid
      </p>
    </div>

    <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
      <p className="text-slate-400">
        Credit Used
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mt-2">
         $0
      </h2>

      <p className="text-slate-400 mt-2">
        No credit accounts
      </p>
    </div>

  </div>

  <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-2xl p-6">

    <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">

      <h2 className="text-3xl font-bold text-white">
        Bank Accounts
      </h2>

      <button className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg">
        Connect Bank via Plaid
      </button>

    </div>

    <div className="space-y-4">
      {accounts?.map((account) => (
        <AccountCard
          key={account.accountId}
          account={account}
        />
      ))}
    </div>

  </div>

</div>


);
};

export default Accounts;
