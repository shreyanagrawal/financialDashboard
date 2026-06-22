import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Home from './pages/Home';
import Nav from "./components/Nav";
import { AuthContext } from './utils/AuthContext';
import { useState } from 'react';
import Accounts from './pages/Accounts';
import PlaidRoute from './components/PlaidRoute';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import EditBudget from './pages/EditBudget';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import EditTransactions from './pages/EditTransactions';
function App() {
  const [accessToken, setAccessToken] = useState();
  const [userData, setUserData] = useState({});
  const [loading,setLoading] = useState(true); 
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, userData, setUserData, loading, setLoading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PlaidRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/accounts" element={<Accounts userId={userData._id}/>}/>
            <Route path="/editTransaction" element={<EditTransactions />}/>
            <Route path="/transactions" element={<Transactions />}/>
            <Route path="/editbudget" element={<EditBudget />}/>
            <Route path="/budget" element={<Budget />}/>
            <Route path="/analytics" element={<Analytics userId={userData._id}/>}/>
            <Route path="/profile" element={<Profile userId={userData._id}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
export default App;