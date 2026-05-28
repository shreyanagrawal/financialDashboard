import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const {userData} = useContext(AuthContext);
  const [transactions,setTransactions] = useState([]);
  const loadTransactions =async () => {
      if (!userData?._id) return;
      try {
        const response = await axios.get(`http://localhost:3001/api/all-transactions/${userData._id}`,
            {
              withCredentials: true
            }
          );
        setTransactions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  useEffect(() => {
    if(userData?._id){
      loadTransactions();
    }},[userData]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-4 py-4">
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Personal Finance Dashboard
          </h1>
          <p className="text-blue-100 text-sm sm:text-lg">
            Track spending, monitor accounts and manage budgets.
          </p>
        </div>
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition p-6">
            <p className="text-gray-500 text-sm">Total Balance</p>
            <h2 className="text-3xl font-bold text-green-600 mt-3">
              ₹0
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition p-6">
            <p className="text-gray-500 text-sm">Monthly Expenses</p>
            <h2 className="text-3xl font-bold text-red-500 mt-3">
              ₹0
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition p-6">
            <p className="text-gray-500 text-sm">Connected Accounts</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-3">
              {transactions.length > 0 ? 1 : 0}
            </h2>
          </div>
        </div>
        {/* TRANSACTIONS */}
        <div className="mt-8 w-full lg:w-1/2 bg-white rounded-3xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">

            <h2 className="text-lg sm:text-xl font-semibold">
                Recent Transactions
              </h2>
              <Link to="/transactions" className=" text-blue-600 font-medium hover:text-blue-700 ml-65 transition">View all → </Link>
            </div>
          {transactions.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No transactions yet
            </p>
          )}
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.transactionId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {tx.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.category?.[0] || "Transaction"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={`text-base font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                  ₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;