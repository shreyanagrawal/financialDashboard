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
  useEffect(()=>{
    loadProfile();
    createLinkToken();
  },[]);
  const navigate = useNavigate();
  const loadProfile = async()=>{
    try{
      const data = await fetchWithAuth(accessToken,setAccessToken);
      if(data.user._id !== null){
        setUserId(data.user._id);
        console.log("User is authorized")
      }
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
    <div className="p-10">
      <div className="flex gap-4">
        <button onClick={() => open()} disabled={!ready} className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer">Connect Bank</button>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer">Logout</button>
      </div>
      <h1>Home</h1>
    </div>
  )
};

export default Home;