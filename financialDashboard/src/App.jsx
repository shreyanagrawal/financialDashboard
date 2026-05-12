import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Home from './pages/Home';
import { AuthContext } from './utils/AuthContext';
import { useState } from 'react';

  function App() {
    const [accessToken,setAccessToken] = useState("");
    return (
      <AuthContext.Provider value={{accessToken,setAccessToken}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />}/>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    );
  }

export default App;

