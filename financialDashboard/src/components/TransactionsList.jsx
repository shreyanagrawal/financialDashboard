import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TransactionsList = ({transactions}) => {
    const path = useLocation();  
    const [filter, setFilter] = useState("all");  
    const filters = ['All',...new Set(transactions.map(tx=>tx.merchantName.split(" *//")))];
    const filteredTransactions = useMemo(()=>{
        const filtered = transactions.filter(tx => {
            const matchesFilter = filter.toLowerCase() === 'all' || tx.merchantName.toLowerCase() === filter.toLowerCase();
            return matchesFilter;
        })
        return filtered;
    },[filter])
    return (
        <div className="bg-white rounded-2xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between px-8 py-4 border-b border-slate-600 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-tr-2xl rounded-tl-2xl">
                <h2 className="text-white text-sm">Recent Transactions</h2>
                {path.pathname === "/home" && 
                    <Link to="/transactions"><h2 className="text-white text-sm text-right flex items-center justify-end gap-1 cursor-pointer">View All <ArrowRight className="w-4 h-4"/></h2></Link>
                }
                {path.pathname === "/transactions" && 
                    <select className="text-white text-sm text-right flex items-center justify-end gap-1 cursor-pointer" onChange={(e)=>setFilter(e.target.value)} value={filter}>
                        {filters.map((filter)=>
                            <option key={crypto.randomUUID()} value={filter}>{filter}</option>
                        )}
                    </select>
                }
            </div>
            <div className="px-8 pb-8">
                {filteredTransactions.map((tx)=>(
                    <div className="flex justify-between px-2 pt-3 pb-1 border-b border-slate-200 last:border-b-0" key={tx.transactionId}>
                        <div className="transaction-category">
                            <p className="text-gray-500 text-sm">{tx?.merchantName.split(" *//")[0]}</p>
                            <p className="text-gray-500 text-xs">{tx?.name.split(" *//")[0]}</p>
                        </div>
                        <div className="transaction-details">
                            <p className={`text-sm ${Number(tx.amount) > 0 ? "text-red-500" : "text-green-500"} font-semibold`}>{Number(tx.amount) < 0 ? "" : "-"}$
                                {Math.abs(Number(tx.amount)).toFixed(2)}</p>
                            <p className="text-gray-500 text-xs text-right">{new Date(tx.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default TransactionsList
