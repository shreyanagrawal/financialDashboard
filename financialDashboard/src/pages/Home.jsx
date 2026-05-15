import { useEffect,useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { usePlaidLink } from "react-plaid-link";
const API_URL = import.meta.env.VITE_API_URL;

const Home = ()=>{
  const {accessToken, setAccessToken} = useContext(AuthContext);
  const [linkToken, setLinkToken] = useState(null);
  useEffect(()=>{
    loadProfile();
    createLinkToken();
  },[]);
  const navigate = useNavigate();
  const loadProfile = async()=>{
    try{
      const data = await fetchWithAuth(accessToken,setAccessToken);
      if(data.user._id !== null)
        console.log("User is authorized")
      else 
        navigate("/");
    } catch(err) {
      console.log(err);
      navigate("/");
    }
  };

  const createLinkToken = async () => {
    try{
       const response = await axios.post(
        `${API_URL}/api/plaid/create-link-token`,
        {},
        {
          withCredentials:true
        }
       );
       setLinkToken(response.data.link_token)
    }
    catch(error){
      console.log(error);
    }
  };
  const {open, ready} = usePlaidLink({
    token:linkToken,
    onSuccess: async (Public_token, metadata) =>  {
      console.log("Public Token:", Public_token);
      console.log("Metadata:", metadata);
    },
  })

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
    <div className="p-10">
      <div className="flex gap-4">
        <button onClick={() => open()} disabled={!ready} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Connect Bank</button>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg">Logout</button>
      </div>
      <h1>Home</h1>
    </div>
  )
};

export default Home;