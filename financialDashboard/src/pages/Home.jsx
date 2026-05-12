import { useEffect,useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_URL;

const Home = ()=>{
  const {accessToken, setAccessToken} = useContext(AuthContext);
  useEffect(()=>{
    loadProfile();
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
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Home</h1>
    </div>
  )
};

export default Home;