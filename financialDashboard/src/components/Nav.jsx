import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../utils/AuthContext";
import { PlaidContext } from "../utils/PlaidContext";
import { getAccountsData, getTransactionsData ,fetchWithAuth, createLinkToken, fetchPlaidData, logoutUser} from "../utils/api";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import LoadingScreen from "./LoadingScreen";
const API_URL = import.meta.env.VITE_API_URL;
const Nav = () => {
  const { accessToken, setAccessToken, userData, setUserData, loading,setLoading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [publicToken,setPublicToken] = useState("");
  const {accounts, setAccounts, transactions, setTransactions, isDataAvailable, setisDataAvailable} = useContext(PlaidContext);
  const location = useLocation();
  const navigate = useNavigate();
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    loadProfile();
    generateLinkToken();
  }, []);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location.pathname]);
  useEffect(()=>{
    if(userData){
      loadAccounts();
      loadTransactions();
    }
  },[userData],[])
  const loadProfile = async () => {
    try {
      debugger;
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
        const accountsData = accounstData.flatMap(
            doc => doc.items
        );
        setAccounts(accountsData);
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
          }));
        });
        const flattenedManualTransactions = transactionsData.flatMap(item => {
          return item?.manualTransactions.map(tx => ({
            ...tx
          }))
        });
        var transactions = [...flattenedTransactions, ...flattenedManualTransactions];
        transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactions(transactions);
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
          setTimeout(()=>{setLoading(false)
        },1000);
        console.log(fetchedData.data);
      }
    } catch (error){
      console.log(error)
    }
  }
  useEffect(()=>{
    let timer;
    if(Object.keys(userData).length > 0){
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000); 
    }
      
    return () => clearTimeout(timer);
  },[userData])
  return (
    <div className="min-h-screen bg-gray-100 absolute top-0" style={{"width": "100%"}}>
      {!loading && <Navbar open={open} ready={ready} handleLogout={handleLogout} username={userData?.name || userData?.email?.split("@")[0].replace(/\b\w/g, char => char.toUpperCase()) || "User"}/>}  
      <div className="flex">
        <button
          className={`lg:hidden fixed top-4 left-4 z-100 bg-blue-600 text-white p-3 rounded-xl shadow-lg ${
            sidebarOpen ? "hidden" : "block"
          }`} 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-8 relative">
            <Outlet context={{ open, ready }} />
            {loading && (
              <LoadingScreen text="Loading Data..." />
            )}
        </div>
      </div>
    </div>
  );
};
export default Nav;