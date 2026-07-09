import React, { useContext, useEffect } from 'react'
import { PlaidContext } from '../utils/PlaidContext'
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const PlaidStats = ({transactions}) => {
    const {accounts, setAccounts} = useContext(PlaidContext);
    const {loading, setLoading} = useContext(AuthContext);
    useEffect(() => {
        setLoading(!accounts || !transactions);
    }, [accounts, transactions, setLoading]);
    const totalBalance = accounts?.reduce((sum, item) => {
        return (
        sum + item.accounts.reduce(
            (acc, account) => acc + (account.balances?.current || 0),0
        )
        );
    }, 0) || 0;
    const connectedAccounts = accounts.reduce((total,item)=> total + item.accounts.length,0)
    const creditsUsed = (accounts.length * 10) + (connectedAccounts * 2) + Math.floor(transactions.length / 100);
    const totalExpenses = transactions.filter(tx => tx.amount > 0 && !tx.pending).reduce((sum, tx) => sum + tx.amount, 0);
    const totalIncome = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const expenseCount = transactions.filter(t => t.amount > 0).length;
    const incomeCount = transactions.filter(t => t.amount < 0).length;
    const path = useLocation();
    const savings = totalIncome - totalExpenses;
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname !== "/transactions" && path.pathname !== "/analytics" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Balance</h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">${Number(totalBalance).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            {path.pathname === "/accounts" && <p className="text-green-400 mt-2"> Across {connectedAccounts} accounts </p>}
                        </>
                    }
                    {path.pathname === "/transactions" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Transactions</h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">{transactions.length}</p>
                        </>
                    }
                    {path.pathname ==="/analytics" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Income</h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">${Number(totalIncome).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            <p className="text-green-400 mt-2"> {incomeCount} transactions </p>
                        </>
                    }
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname === "/home" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2"> Total Expenses</h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-500">${Number(totalExpenses).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                        </>
                    }
                    {path.pathname === "/accounts" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2"> Credits Used</h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-500">{creditsUsed}</p>
                        </>
                    }
                    {path.pathname === "/transactions" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Income</h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">${Number(totalIncome).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            <p className="text-green-400 mt-2"> {incomeCount} transactions </p>
                        </>
                    }
                    {path.pathname ==="/analytics" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Expenses</h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-600">${Number(totalExpenses).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            <p className="text-red-400 mt-2"> {expenseCount} transactions </p>
                        </>
                    }
                </div>                 
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname === "/accounts" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Connected Accounts</h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">{connectedAccounts}</p>
                        </>
                    }
                    {path.pathname === "/home" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Connected Banks</h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">{accounts.length}</p>
                        </>
                    }
                    {path.pathname === "/transactions" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Total Expenses</h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-600">${Number(totalExpenses).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            <p className="text-red-400 mt-2"> {expenseCount} transactions </p>

                        </>
                    }
                    {path.pathname === "/analytics" && 
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">Savings</h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">{Number(savings) < 0 ? "-" : ""}${Math.abs(Number(savings)).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}</p>
                            

                        </>
                    }
                </div> 
            </div>
        </div>
    )
}
export default PlaidStats
