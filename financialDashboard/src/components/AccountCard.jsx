import { useState } from "react";
import { updateLinking } from "../utils/api";
import { Link } from "lucide-react";
import { PlaidContext } from "../utils/PlaidContext";
import { useContext } from "react";
import { getAccountsData } from "../utils/api";

const AccountCard = ({account,userId}) => {
  const {accounts, setAccounts} = useContext(PlaidContext);
  const updateAccountsLink = async(id, userId, isLinked)=>{
    const updatedStatus = await updateLinking(id, userId, isLinked);
    loadAccounts()
  }
  const loadAccounts = async()=>{
    const accounstData = await getAccountsData(userId);
    setAccounts(accounstData);
  }
  const id= account.accountId;
  return (
    <div className="bg-white rounded-2xl shadow-md pb-5">
      {
        account.isActive ? 
          <span className="text-red-500 text-sm font-bold text-right block px-3 pt-2 cursor-pointer" onClick={()=>updateAccountsLink(id, userId, true)}>x</span> : 
          <span className="text-green-500 text-sm font-bold text-right block px-3 pt-2 cursor-pointer" onClick={()=>updateAccountsLink(id, userId, false)}><Link className="w-5 h-5 ml-auto"/></span>
      }
      <div className="p-6 pt-1 pb-0 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center hover:border-blue-500 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#314463] flex items-center justify-center text-xl">🏦</div>
          <div>
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-slate-400">{account.subtype}</p>
            <p className="text-slate-500 text-sm">**** {account.mask}</p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto gap-5">
          <div className="text-right">
            <p className="text-green-400 text-xl font-bold">${Number(account?.balances?.current).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}</p>
            <p className="text-slate-400 text-sm">Available balance</p>
          </div>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${account.isActive ? "linked": "unlinked"}`}>{account?.isActive ? "Linked" : "Not Linked"}</span>
        </div>
      </div>
      <small className="text-xs text-slate-400 block text-right px-6">Synced via Plaid</small>
    </div>
    
  );
};
export default AccountCard;