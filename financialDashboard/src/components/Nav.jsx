import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [netWorth, setNetWorth] = useState(null);

  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/api/me')
      .then((res) => {
        setUser(res.data.user);
        // If backend returns account summary, compute net worth
        if (res.data.accounts && Array.isArray(res.data.accounts)) {
          const total = res.data.accounts.reduce((acc, a) => {
            const current = a.balances?.[0]?.current ?? 0;
            return acc + current;
          }, 0);
          setNetWorth(total);
        }
      })
      .catch(() => {
        // ignore, api interceptor handles 401
      })
      .finally(() => setLoading(false));
  }, [location.pathname]);

  // Hide nav on the login page
  if (location.pathname === '/') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const shortName = user?.email ? user.email.split('@')[0] : '';

  return (
    <nav className="w-full bg-white shadow p-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/home" className="text-xl font-bold text-gray-800">FinancialDashboard</Link>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">Hello{!loading && user ? ',' : ''}</span>
            <span className="text-sm font-semibold text-gray-800">{shortName || 'Guest'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Link to="/home" className="text-gray-600 hover:text-gray-800">Financial Data</Link>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Connect Bank</button>
            <Link to="/about" className="text-gray-600 hover:text-gray-800">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">{netWorth !== null ? `Net worth: $${netWorth.toFixed(2)}` : 'Net worth: —'}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
