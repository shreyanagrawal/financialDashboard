import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Home from './pages/Home';
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import Nav from "./components/Nav";
import { AuthContext } from './utils/AuthContext';
import { useState } from 'react';

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [userData, setUserData] = useState({});

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, userData, setUserData }}>
      <BrowserRouter>
        <Routes>
          {/* login page */}
          <Route path="/" element={<Login />} />
          {/* dashboard layout */}
          <Route element={<Nav />}>
            <Route path="/home" element={<Home />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/settings" element={<Settings />}/></Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
export default App;