import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { PlaidContext } from '../utils/PlaidContext';
import { getTransactionsData } from '../utils/api';
import PlaidStats from '../components/PlaidStats';
import TransactionsList from '../components/TransactionsList';
import { AuthContext } from '../utils/AuthContext';

const Transactions = () => {
    const {loading, setLoading} = useContext(AuthContext);
    const {accounts, setAccounts, transactions, setTransactions} = useContext(PlaidContext);
    useEffect(() => {
        if (transactions) {
            setTimeout(()=>{setLoading(false)
            },1000);        
        }
    }, [transactions]);

    if (loading) return <h1>Loading..</h1>;

    return (
        <div className="p-5">
            <PlaidStats transactions={transactions}/>
            <div className="rounded-2xl">
                <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:justify-between md:items-center mb-6">
                    <h2 className="text-3xl font-bold ">Transactions History</h2>
                </div>
                {transactions.length > 0 && 
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10 mt-10">
                        <TransactionsList transactions={transactions}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default Transactions
