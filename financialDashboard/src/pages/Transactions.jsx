import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { PlaidContext } from '../utils/PlaidContext';
import { getTransactionsData } from '../utils/api';
import PlaidStats from '../components/PlaidStats';
import TransactionsList from '../components/TransactionsList';
import { getManualTransactions } from "../utils/api";
import ManualTransactionsList from "../components/ManualTransactionsList";
import { AuthContext } from "../utils/AuthContext";

const Transactions = () => {
    const { userData } = useContext(AuthContext);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [manualTransactions, setManualTransactions] = useState([]);
    const {accounts, setAccounts, transactions, setTransactions} = useContext(PlaidContext);
    useEffect(() => {
        if (userData?._id) {
            loadManualTransactions();
        }
    }, [userData]);
    const loadManualTransactions = async () => {
        try {
            const data = await getManualTransactions(userData._id);
            setManualTransactions(data || []);
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) return <h1>Loading..</h1>;

    return (
        <div className="p-5">
            <PlaidStats transactions={transactions} manualTransactions={manualTransactions} />

            <div className="rounded-2xl">
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
                    <h2 className="text-3xl font-bold ">Transactions History</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "all"
                                ? "bg-blue-600 text-white "
                                : "bg-white border border-gray-300"
                            }`}
                    >
                        All Transactions
                    </button>
                    <button
                        onClick={() => setFilter("manual")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "manual"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300"
                            }`}
                    >
                        Manual Transactions
                    </button>
                    <button
                        onClick={() => setFilter("bank")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === "bank"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300"
                            }`}
                    >
                        Bank Transactions
                    </button>
                </div>
                <div className={`gap-6 mb-10 mt-10 ${filter === "all"? "grid grid-cols-1 md:grid-cols-2 h-[75vh] rounded-2xl": "grid grid-cols-1" }`}>
                    
                    {/* Bank Transactions */}
                    {(filter === "all" || filter === "bank") && (
                        <div className={`${filter === "all"? "h-full overflow-y-auto pr-2 rounded-2xl ": "col-span-full" }`}>
                            <TransactionsList transactions={transactions} />
                        </div>
                    )}

                    {/* Manual Transactions */}
                    {(filter === "all" || filter === "manual") && (
                        <div className={`${filter === "all"? "h-full overflow-y-auto pr-2 rounded-2xl": "col-span-full"}`}>
                            <ManualTransactionsList transactions={manualTransactions} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Transactions
