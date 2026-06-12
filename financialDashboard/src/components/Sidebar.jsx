import { Link } from "react-router-dom"
import "../assets/css/style.css"
import { PlaidContext } from "../utils/PlaidContext";
import { useState, useContext } from "react";
import { useEffect } from "react";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const {isDataAvailable, setisDataAvailable} = useContext(PlaidContext);
  useEffect(() => {
   
  if (sidebarOpen && window.innerWidth < 1024) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [sidebarOpen]);
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`sidebar fixed top-0 left-0 h-full w-56 sm:w-64 bg-white shadow-lg p-6 z-50 overflow-y-auto
        transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">FinDash</h2>
        <div className="flex flex-col gap-4">
          <Link to="/home"><span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Dashboard</span></Link>
          <Link to="/accounts" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Accounts</span>
          </Link>
          <Link to="/transactions" onClick={(e) => {
              if (!isDataAvailable)
                e.preventDefault();
            }}><span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Transactions</span></Link>
          <span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Analytics</span>
          <span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Budgets</span>
          <span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">Settings</span>
          <Link to="/profile">
             <span className="block text-left px-4 py-2 rounded-xl font-medium hover:bg-gray-100">
               Profile
             </span>
           </Link>
        </div>
      </div>
    </>
  );
};
export default Sidebar;