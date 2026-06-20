import { Link } from "react-router-dom"
import "../assets/css/style.css"
import { PlaidContext } from "../utils/PlaidContext";
import { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const {isDataAvailable, setisDataAvailable} = useContext(PlaidContext);
  const {loading, setLoading} = useContext(AuthContext);
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`sidebar fixed top-0 left-0 h-full w-56 sm:w-64 bg-white shadow-lg p-6 z-50
        transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <h2 className="text-2xl font-bold text-blue-700 mb-10">FinDash</h2>
        <div className="flex flex-col gap-4">
          <Link to="/home"><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Dashboard</span></Link>
          <Link to="/accounts" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Accounts</span>
          </Link>
          <Link to="/transactions" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Transactions</span>
          </Link>
          <Link to="/analytics" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Analytics</span>
          </Link>
          <Link to="/budget" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Budgets</span>
          </Link>
          <Link to="/profile"><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">My Profile</span></Link>
        </div>
      </div>
    </>
  );
};
export default Sidebar;