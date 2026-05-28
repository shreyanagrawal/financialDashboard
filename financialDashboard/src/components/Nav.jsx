import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../utils/AuthContext";
import { fetchWithAuth } from "../utils/api";
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
  const navigate = useNavigate();
  useEffect(() => {
    loadProfile();
    createLinkToken();
  }, []);
  const loadProfile = async () => {
    try {
      const data = await fetchWithAuth(accessToken, setAccessToken);
      if (data.user._id !== null) {
        setUserData(data.user);
      }
      else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const createLinkToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/create-link-token`,
        {},
        {
          withCredentials: true
        }
      );
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
      const deleted = await axios.delete(
        `${API_URL}/api/refresh`,
        {
          withCredentials: true
        }
      );
      if (deleted.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    async function fetchData(publicToken) {
      if(publicToken !== ''){
        const resData = await axios.post(`${API_URL}/api/exchange_public_token`,{public_token:publicToken, user_id : userData._id},{
          withCredentials:true
        });
        try{
          console.log(resData.data);
          const balanceData = await axios.post(`${API_URL}/api/balances`, { user_id: userData._id },{
            withCredentials: true
          });
          try{
            console.log(balanceData.data);
            const transactionData = await axios.post(`${API_URL}/api/transactions`,
                {
                  user_id:userData._id
                },
                {
                  withCredentials: true
                }
              );
            console.log(transactionData.data);

          } catch (error){
            console.log(error)
          }
        } catch (error){
          console.log(error)
        }
        // try{
        //    console.log(resData);
        //   //  console.log("AccessToken",resData.data);
        //   const auth = await axios.post(`${API_URL}/api/auth`,{access_token: resData.data.accessToken});
        //   console.log("Authenticated data",auth.data)
        // } catch (error) {
        //   console.log(error)
        // }
      }
    }
    fetchData(publicToken)
  },[publicToken])
  useEffect(()=>{
    if(Object.keys(userData).length > 0)
      setLoading(false);
  },[userData])
  if(loading) return <h1>Loading..</h1>
  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <Navbar
        open={open}
        ready={ready}
        handleLogout={handleLogout}
        username={userData.email.split("@")[0]}
      />
      <div className="flex pt-[88px]">
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >☰</button>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 lg:ml-64 p-4 md:p-6  h-[calc(100vh-88px)] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Nav;