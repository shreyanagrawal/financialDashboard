import { useContext, useEffect, useLayoutEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import { PlaidContext } from "../utils/PlaidContext";
import { AuthContext } from "../utils/AuthContext";
import PlaidStats from "../components/PlaidStats";
import NoPlaidData from "../components/NoPlaidData";
import { useOutletContext } from "react-router-dom";
import TransactionsList from "../components/TransactionsList";
import BankCard from "../components/BankCard";
import TransactionChart from "../components/TransactionChart";
const Home = () => {
  const {accounts,setAccounts, isDataAvailable, setisDataAvailable, transactions, setTransactions} = useContext(PlaidContext);
  const {userData,setUserData, loading, setLoading} = useContext(AuthContext);
  useLayoutEffect(()=>{
    if (accounts === null || transactions === null) return;
    setisDataAvailable(accounts?.length > 0 && transactions?.length > 0);
   const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  },[accounts,transactions])
  if(!isDataAvailable && !loading) return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <NoPlaidData />
    </div>
  )
  return (
    <>
      {!loading && 
        <div className="min-h-screen bg-gray-100">
          <div className="flex-1 px-4 pt-4 md:px-8 md:pt-8 pb-0">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-4 md:p-8 text-white shadow-lg mb-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">Personal Finance Dashboard</h1>
              <p className="text-blue-100 text-sm md:text-lg">Track your spending, manage budgets, and monitor your financial health.</p>
            </div>
            <PlaidStats transactions={transactions}/>
            {transactions !== null && transactions.length > 0 && 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 mt-10">
                <TransactionsList transactions={transactions.slice(0,8)}/>
                <TransactionChart transactions={transactions}/>
              </div>
            }
          </div>
          <h2 className="px-4 pb-4 md:px-8 md:pb-8 pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Connected Banks</h2>
          <div className="dashboard p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {accounts?.map(account =>
              <BankCard key = {account._id}
                bank = {account} />
            )}
          </div>
        </div>
      }
    </>
    
  );
};
export default Home;