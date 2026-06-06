import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../utils/AuthContext";
import { PlaidContext } from "../utils/PlaidContext";
import { fetchWithAuth } from "../utils/api";
import { createLinkToken } from "../utils/api";
import { fetchPlaidData } from "../utils/api";
import { logoutUser } from "../utils/api";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
const API_URL = import.meta.env.VITE_API_URL;
const Nav = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [publicToken,setPublicToken] = useState("");
  const {userData,setUserData} = useContext(AuthContext);
  const [loading,setLoading] = useState(true);
  const [accounts,setAccounts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    loadProfile();
    generateLinkToken();
  }, []);
  const loadProfile = async () => {
    try {
      const data = await fetchWithAuth(accessToken, setAccessToken);
      if (data.user._id !== null) 
        setUserData(data.user);
      else 
        navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
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
    fetchData(publicToken, userData.userId);
  },[publicToken])
  const fetchData = async(publicToken, userId)=>{
    try{
      const fetchedData = await fetchPlaidData(publicToken,userId);
      if(fetchedData.status)
        console.log(fetchedData.data);
    } catch (error){
      console.log(error)
    }
  }
  useEffect(()=>{
    if(Object.keys(userData).length > 0)
      setLoading(false);
  },[userData])
  if(loading) return <h1>Loading..</h1>
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar open={open} ready={ready} handleLogout={handleLogout} username={userData.email.split("@")[0]}/>
      <div className="flex">
        <button className="lg:hidden fixed top-4 left-2 z-[60] bg-blue-600 text-white p-2 rounded-lg shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 md:p-8 pt-24 lg:ml-56 xl:ml-64">
          <PlaidContext.Provider value={{accounts, setAccounts}}>
            <Outlet />
          </PlaidContext.Provider>
        </div>
      </div>
    </div>
  );
};
export default Nav;