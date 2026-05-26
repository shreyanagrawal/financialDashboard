import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./pages/Login";
import Home from './pages/Home';

import Nav from "./components/Nav";

import { AuthContext } from './utils/AuthContext';
import { useState } from 'react';

function App() {

  const [accessToken, setAccessToken] = useState("");

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>

      <BrowserRouter>

        <Routes>

          {/* Auth page */}
          <Route path="/" element={<Login />} />

          {/* Pages with Navbar + Sidebar */}
          <Route element={<Nav />}>

            <Route path="/home" element={<Home />} />

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthContext.Provider>
  );
}

export default App;