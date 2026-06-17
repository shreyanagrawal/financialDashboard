import { Outlet, useNavigate } from "react-router-dom";
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
  const { accessToken, setAccessToken, userData, setUserData, loading,setLoading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [publicToken,setPublicToken] = useState("");
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
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar open={open} ready={ready} handleLogout={handleLogout} username={userData?.email?.split("@")[0] || "User"}/>
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
        <div className="flex-1 p-8">
            {loading ? <h1>Loading....</h1> : <Outlet context={{ open, ready }} />}
        </div>
      </div>
    </div>
  );
};
export default Nav;