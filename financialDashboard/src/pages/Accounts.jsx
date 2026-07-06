import axios from "axios";
import { useEffect, useState, useContext } from "react";
import AccountCard from "../components/AccountCard";
import { getAccountsData } from "../utils/api";
import { PlaidContext } from "../utils/PlaidContext";
import PlaidStats from "../components/PlaidStats";
import BankSelectionModal from "../components/BankSelectionModal";
import { AuthContext } from "../utils/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;
const Accounts = (userId) => {
  const {loading, setLoading} = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const {accounts, setAccounts, transactions, setTransactions} = useContext(PlaidContext);
  useEffect(() => {
    if (accounts) {
     const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); 
    }
    return () => clearTimeout(timer);
  }, [accounts]);
  const loadAccounts = async(userId)=>{
    const accounstData = await getAccountsData(userId);
    const accountsData = accounstData.flatMap(
        doc => doc.items
    );
    setAccounts(accountsData);
  }
  const handleAddAccountSuccess = () => {
    loadAccounts(userId.userId);
  }
  return ( 
    <>
      {!loading && 
        <div className="p-5">
          <PlaidStats transactions={transactions}/>
          <div className="rounded-2xl">
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
              <h2 className="text-3xl font-bold ">Bank Accounts</h2>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg hover:bg-green-800 transition-colors font-medium"
              >Add Accounts</button>
              {/* <button className="w-full md:w-auto bg-green-900 text-green-300 px-4 py-2 rounded-lg">Connect Bank via Plaid</button> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {accounts?.flatMap(item =>
                  item.accounts.map(account => (
                    <AccountCard
                      key={account.accountId}
                      account={account}
                      bankName={item.officialName}
                      userId={userId.userId}
                      loadAccounts={loadAccounts}
                    />
                  ))
                )}
            </div>
          </div>
          <BankSelectionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            banks={accounts}
            userId={userId}
            onSuccess={handleAddAccountSuccess}
          />
        </div>
      }
    </>
    
  );
};

export default Accounts;
