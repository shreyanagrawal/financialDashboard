import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlaidContext } from '../utils/PlaidContext';
import { ChevronDown } from 'lucide-react';

const TransactionsList = ({transactions}) => {
    const path = useLocation();  
    const [filter, setFilter] = useState("all");   
    const filters = useMemo(()=>{
        return ['All',...new Set(transactions.map(tx => tx.accountId ? tx?.merchantName?.split(" *//")[0]: "Manual"))];
    },[transactions])
    const filteredTransactions = useMemo(()=>{
        return transactions.filter(tx => {
            if (filter.toLowerCase() === "all") {
                return true;
            }
            if (filter.toLowerCase() === "manual") {
                return !tx.accountId;
            }
            return (
                tx.accountId &&
                tx?.merchantName?.split(" *//")[0].toLowerCase().trim() === filter.toLowerCase()
            );
        })
        return filtered;
    },[filter, transactions])
    return (
        <div className="bg-white rounded-2xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between px-8 py-4 border-b border-slate-600 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-tr-2xl rounded-tl-2xl align-middle">
                <h2 className="text-white">Recent Transactions</h2>
                {path.pathname === "/home" && 
                    <Link to="/transactions"><h2 className="text-white text-sm text-right flex items-center justify-end gap-1 cursor-pointer">View All <ArrowRight className="w-4 h-4"/></h2></Link>
                }
                {path.pathname === "/transactions" && (
                    <div className="relative w-full md:w-auto md:min-w-[200px] md:justify-self-end mt-3 md:mt-0">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors text-sm" onChange={(e)=>setFilter(e.target.value.split(" *//")[0])} value={filter}>
                        {filters.map((filter, index)=>(
                            <option key={index} value={filter?.split("*//")[0].toLowerCase()}>{filter}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <ChevronDown size={18} strokeWidth={2.5} />
                    </div>
                </div>
                )}
                </div>
            <div className={`px-8 pb-8 ${path.pathname === "/transactions" ? "maxHeight": ""}`}>
                {filteredTransactions.map((tx)=>(
                    <div className="flex justify-between px-2 pt-3 pb-1 border-b border-slate-200 last:border-b-0" key={tx.transactionId ? tx.transactionId : tx._id}>
                        <div className="transaction-category">
                            <p className="text-gray-500 text-sm">{tx.merchantName? tx?.merchantName?.split(" *//")[0] : `${tx.merchant}  ${tx.type.charAt(0).toUpperCase()}`}</p>
                            <p className="text-gray-500 text-xs">{tx.name ? tx?.name?.split(" *//")[0]: `${tx.category} (manual)`}</p>
                        </div>
                        <div className="transaction-details">
                            <p className={`text-sm ${Number(tx.amount) > 0 ? "text-red-500" : "text-green-500"} font-semibold`}>{Number(tx.amount) > 0 ? "" : "-"}$
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
