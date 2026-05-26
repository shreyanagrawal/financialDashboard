import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect,useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
const API_URL = import.meta.env.VITE_API_URL;

const Home = ()=>{
  const {accessToken, setAccessToken} = useContext(AuthContext);
  const [linkToken, setLinkToken] = useState("");
  const [publicToken,setPublicToken] = useState("");
  const[userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(()=>{
    loadProfile();
    createLinkToken();
  },[]);
  const navigate = useNavigate();
  const loadProfile = async()=>{
    try{
      const data = await fetchWithAuth(accessToken,setAccessToken);
      console.log(data);
      if(data.user._id !== null){
        setUserId(data.user._id);
        setUsername(data.user.email);
        console.log("User is authorized")
      }
      else 
        navigate("/");
    } catch(err) {
       console.log("ERROR:", err);
    } 
  };

  const createLinkToken = async () => {
    try{
       const response = await axios.post(
        `${API_URL}/api/create-link-token`,
        {},
        {
          withCredentials:true
        }
       );
       console.log(response.data.link_token)
       setLinkToken(response.data.link_token)
    }
    catch(error){
      console.log(error);
    }
  };
  const {open, ready} = usePlaidLink({
    token:linkToken,
    onSuccess: async (Public_token, metadata) =>  {
      setPublicToken(Public_token)
      console.log("Public Token:", Public_token);
      console.log("Metadata:", metadata);
    },
  })

  
  useEffect(()=>{
    async function fetchData(publicToken) {
      if(publicToken !== ''){
        const resData = await axios.post(`${API_URL}/api/exchange_public_token`,{public_token:publicToken, user_id : userId},{
          withCredentials:true
        });
        try{
          console.log(resData.data);
          const balanceData = await axios.post(`${API_URL}/api/balances`,{user_id : userId},{
            withCredentials: true
          });
          try{
            console.log(balanceData.data);
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
    
 

  const handleLogout = async() =>{
    try{
      const deleted = await axios.delete(`${API_URL}/api/refresh`,
        {
          withCredentials:true
        }
      );
      if(deleted.status === 200){
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
  <div className="min-h-screen bg-gray-100">

    <Navbar
      open={open}
      ready={ready}
      handleLogout={handleLogout}
      username={username}
    />

    <div className="flex">
      <button
        className="lg:hidden fixed top-5 left-5 z-50 bg-blue-600 text-white p-3 rounded-xl shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 p-8">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg mb-8">
          
          <h1 className="text-4xl font-bold mb-3">
            Personal Finance Dashboard
          </h1>

          <p className="text-blue-100 text-lg">
            Track your spending, manage budgets, and monitor your financial health.
          </p>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2">
              Total Balance
            </h2>

            <p className="text-3xl font-bold text-green-600">
              ₹0
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2">
              Monthly Expenses
            </h2>

            <p className="text-3xl font-bold text-red-500">
              ₹0
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2">
              Connected Accounts
            </h2>

            <p className="text-3xl font-bold text-blue-600">
              0
            </p>
          </div>

        </div>

        {/* Activity Section */}
        <div className="mt-10 bg-white rounded-2xl shadow-md p-8">
          
          <h2 className="text-2xl font-semibold mb-4">
            Recent Activity
          </h2>

          <p className="text-gray-500">
            Transactions and analytics will appear here once a bank account is connected.
          </p>

        </div>

      </div>

    </div>

  </div>
)
};

export default Home;