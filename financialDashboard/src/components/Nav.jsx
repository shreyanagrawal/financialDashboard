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

  const [username, setUsername] = useState("");

  const [linkToken, setLinkToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    createLinkToken();
  }, []);

  const loadProfile = async () => {
    try {

      const data = await fetchWithAuth(accessToken, setAccessToken);

      if (data.user._id !== null) {
        setUsername(data.user.email);
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
    console.log(public_token);
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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar
        open={open}
        ready={ready}
        handleLogout={handleLogout}
        username={username}
      />

      <div className="flex">

        {/* Hamburger */}
        <button
          className="lg:hidden fixed top-5 left-5 z-50 bg-blue-600 text-white p-3 rounded-xl shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Current Page */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Nav;