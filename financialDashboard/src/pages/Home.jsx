import { useContext, useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import { PlaidContext } from "../utils/PlaidContext";
import { AuthContext } from "../utils/AuthContext";
import { getAccountsData } from "../utils/api";
import { getTransactionsData } from "../utils/api";
import PlaidStats from "../components/PlaidStats";
const Home = () => {
  const {accounts,setAccounts} = useContext(PlaidContext);
  const {userData,setUserData} = useContext(AuthContext);
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);
  useEffect(()=>{
    if(transactions.length > 0)
      setLoading(false);
    else {
      console.log("No data available");
      setLoading(false);
    }
  },[transactions])
  const loadAccounts = async()=>{
    const accounstData = await getAccountsData(userData._id);
    setAccounts(accounstData);
  }
  const loadTransactions = async()=>{
    const transactionsData = await getTransactionsData(userData._id);
    const transactions = transactionsData.flatMap(item => item.transactions);
    setTransactions(transactions);
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-4 md:p-8 text-white shadow-lg mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Personal Finance Dashboard</h1>
          <p className="text-blue-100 text-sm md:text-lg">Track your spending, manage budgets, and monitor your financial health.</p>
        </div>
        <PlaidStats transactions={transactions}/>
        <div className="mt-10 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Transactions and analytics will appear here once a bank account is connected.</p>
        </div>
      </div>
      <h2 className="p-4 md:p-8 text-2xl font-semibold" style={{paddingBottom: 0}}>Connected Bank Accounts</h2>
      <div className="dashboard p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
  );
};
export default Home;