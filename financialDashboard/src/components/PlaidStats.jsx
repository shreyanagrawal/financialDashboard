import React, { useContext } from 'react'
import { PlaidContext } from '../utils/PlaidContext'
import { useLocation } from 'react-router-dom';

const PlaidStats = ({transactions}) => {
    const {accounts, setAccounts} = useContext(PlaidContext);
    const totalBalance = accounts?.reduce((sum, item) => {
        return (
        sum + item.accounts.reduce(
            (acc, account) => acc + (account.balances?.current || 0),0
        )
        );
    }, 0) || 0;
    const availableBalance = accounts?.reduce((sum, item) => {
        return (
            sum + item.accounts.reduce(
                (acc, account) => acc + (account.balances?.available || 0),
                0
            )
        );
    }, 0) || 0;
    const connectedAccounts = accounts.map((account)=>
        account.accounts.length
    )
    const path = useLocation();
    let totalExpenses = 0
    if(path.pathname === "/home"){
        totalExpenses = transactions
            .filter(tx => tx.amount > 0 && !tx.pending)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }
   
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-gray-500 text-sm mb-2">Total Balance</h2>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">${Number(totalBalance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</p>
                    {path.pathname === "/accounts" && <p className="text-green-400 mt-2"> Across {connectedAccounts} accounts </p>}
                </div>
                {path.pathname === "/home" ?
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-gray-500 text-sm mb-2"> Total Expenses</h2>
                        <p className="text-2xl md:text-3xl font-bold text-red-500">${Number(totalExpenses).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</p>
                    </div> : 
                     <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-gray-500 text-sm mb-2"> Available Balance</h2>
                        <p className="text-2xl md:text-3xl font-bold text-red-500">${Number(availableBalance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</p>
                    </div>
                }
                {path.pathname === "/accounts" ?
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-gray-500 text-sm mb-2">Connected Accounts</h2>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{connectedAccounts}</p>
                    </div> : 
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-gray-500 text-sm mb-2">Connected Banks</h2>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{accounts.length}</p>
                    </div>
                }
            </div>
            {/* <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
                <p className="text-slate-400">Total Balance</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">${Number(totalBalance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}</h2>
                <p className="text-green-400 mt-2"> Across {accounts.length} accounts      </p>
            </div> */}
            {/* <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
                <p className="text-slate-400">Connected Banks</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{accounts.length}</h2>
                <p className="text-slate-400 mt-2">via Plaid</p>
            </div> */}
            {/* <div className="bg-[#1b2942] border border-[#2d3d5b] rounded-xl p-5">
                <p className="text-slate-400">Credit Used</p>
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mt-2">$0</h2>
                <p className="text-slate-400 mt-2">No credit accounts</p>
            </div> */}
        </div>
    )
}

export default PlaidStats
