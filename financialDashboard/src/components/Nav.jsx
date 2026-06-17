import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../utils/AuthContext";
import { PlaidContext } from "../utils/PlaidContext";
import { getAccountsData, getTransactionsData ,fetchWithAuth, createLinkToken, fetchPlaidData, logoutUser} from "../utils/api";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
const API_URL = import.meta.env.VITE_API_URL;
const Nav = () => {
  const { accessToken, setAccessToken, userData, setUserData } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [publicToken,setPublicToken] = useState("");
  const [loading,setLoading] = useState(true);
  const {accounts, setAccounts, transactions, setTransactions, isDataAvailable, setisDataAvailable} = useContext(PlaidContext);

  const navigate = useNavigate();
  useEffect(() => {
    loadProfile();
    generateLinkToken();
  }, []);
  useEffect(()=>{
    if(userData){
      loadAccounts();
      loadTransactions();
    }
  },[userData],[])

  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  const loadProfile = async () => {
    try {
      const data = await fetchWithAuth(accessToken, setAccessToken, navigate);
      if (data.user._id !== null) 
        setUserData(data.user);
      else 
        navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const loadAccounts = async()=>{
    if(!userData)
      return;
    const accounstData = await getAccountsData(userData._id);
    if(accounstData){
      if(accounstData.length > 0){
        setisDataAvailable(true);
        setAccounts(accounstData);
      }
    }
  }
  const loadTransactions = async()=>{
    if(!userData)
      return;
    const transactionsData = await getTransactionsData(userData._id);
    if(transactionsData){
      if(transactionsData.length > 0){
        const flattenedTransactions = transactionsData.flatMap(item => {
          return item.transactions.map(tx => ({
            ...tx,
            plaidItemId: item.plaidItemId
          }));
        });
        setTransactions(flattenedTransactions);
      }
    }
  }
  const generateLinkToken = async () => {
    try {
      const response = await createLinkToken();
      if(response.status)
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.log(error);
      }
  };
  const { open, ready } = usePlaidLink({
      token: linkToken,
      onSuccess: async (public_token, metadata) => {
        setPublicToken(public_token);
        console.log(metadata);
      }
  });
  const handleLogout = async () => {
    try {
      const deleted = await logoutUser();
      if (deleted.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    fetchData(publicToken, userData._id);
  },[publicToken])
  const fetchData = async(publicToken, userId)=>{
    setLoading(true);
    try{
      const fetchedData = await fetchPlaidData(publicToken,userId);
      if(fetchedData.status){
        loadAccounts();
        loadTransactions();
        setLoading(false);
        console.log(fetchedData.data);
      }
    } catch (error){
      console.log(error)
    }
  }
  useEffect(()=>{
    if(Object.keys(userData).length > 0)
      setLoading(false);
  },[userData])
  if(loading) return(
    <div className="absolute inset-0 bg-gray-100 z-40 flex items-center justify-center">
                <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-semibold text-lg">Loading Data...</p>
              </div>
              </div>
  );
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar open={open} ready={ready} handleLogout={handleLogout} username={userData?.name || userData?.email?.split("@")[0] || "User"}/>
      <div className="flex">
        <button
           className={`lg:hidden absolute top-4 left-4 z-30 bg-blue-600 text-white p-3 rounded-xl shadow-lg ${
             sidebarOpen ? "hidden" : "block"
           }`} 
           onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-8 relative">
          {isNavigating ? (
              <div className="absolute inset-0 bg-gray-100 z-40 flex items-center justify-center">
                <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-semibold text-lg">Loading Data...</p>
              </div>
              </div>
            ) : (
            <Outlet context={{ open, ready }} />
            )}
        </div>
      </div>
    </div>
  );
};
export default Nav;