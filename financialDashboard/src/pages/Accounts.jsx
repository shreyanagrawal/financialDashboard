import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

const Accounts = () => {
  const { userData } = useContext(AuthContext);

  const [accounts, setAccounts] = useState([]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const loadAccounts = async () => {
    if (!userData?._id) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/api/accounts/${userData._id}`,
        {
          withCredentials: true,
        },
      );

      setAccounts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [userData]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Accounts</h1>
          <p className="text-gray-500 mt-2">{today}</p>
        </div>
        {/* EMPTY */}
        {accounts.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
            No accounts connected yet
          </div>
        )}
        {/* BANKS */}
        <div className="space-y-6">
          {accounts.map((bank) => (
            <div key={bank._id} className="bg-white rounded-3xl p-6 shadow-sm">
              {/* BANK TITLE */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {bank.officialName}
                </h2>
                <p className="text-gray-500">Connected Accounts</p>
              </div>
              {/* ACCOUNT CARDS */}
              <div className="grid md:grid-cols-2 gap-5">
                {bank.accounts.map((account) => (
                  <div
                    key={account.accountId}
                    className="
                        border
                        border-slate-100
                        rounded-3xl
                        p-5
                        hover:shadow-md
                        transition
                        bg-slate-50
                      "
                  >
                    {/* top */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {account.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {account.subtype}
                        </p>
                      </div>
                      <div className="text-2xl">🏦</div>
                    </div>
                    {/* balances */}
                    <div className="mt-5 space-y-3">
                      <div className="flex justify-between">
                        <p className="text-gray-500">Available</p>
                        <p className="font-semibold text-green-600">
                          ₹{account.balances?.available ?? 0}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-500">Current</p>
                        <p className="font-semibold">
                          ₹{account.balances?.current ?? 0}
                        </p>
                      </div>
                      {account.mask && (
                        <div className="flex justify-between">
                          <p className="text-gray-500">Account</p>
                          <p className="font-medium">
                            ****
                            {account.mask}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
