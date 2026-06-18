import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../utils/AuthContext'
import { PlaidContext } from '../utils/PlaidContext';
import { getAggregatedData, getAmountbyCategory, getTransactionsData } from '../utils/api';
import PlaidStats from '../components/PlaidStats';
import AnalyticsChart from '../components/AnalyticsChart';
import CategoryWiseData from '../components/CategoryWiseData';

const Analytics = (userId) => {
    const {loading, setLoading} = useContext(AuthContext);
    const {transactions, setTransactions} = useContext(PlaidContext);
    const [aggregatedData, setAggregatedData] = useState([]);
    const [timeFilter,setTimeFilter] = useState();
    let month = '';
    useEffect(()=>{
        const fetchData = async () => {
            const data = await loadaggregatedData(userId);
            if(data?.success){
                setAggregatedData(data.data);
            }
        };
        if(transactions?.length){
            fetchData();
        }
    },[transactions],[userId]);
    useEffect(()=>{
        setLoading(false);
    },[aggregatedData])
    const loadaggregatedData = async(userId)=>{
        const data = await getAggregatedData(userId);
        return data;
    }
    const time = ['All', ...new Set(transactions.map((tx) => {
        const txDate = new Date(tx.date);
        return txDate.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });
    }))];
    const selectedMonth = timeFilter ? timeFilter?.split(" ")[0]: "all"; 
    const selectedYear = timeFilter?.split(" ")[1] ;
    useEffect(()=>{
        if(time.length >0 ) 
            setTimeout(()=>{setLoading(false)
            },1000);
    },[time]);
    const currentMonthData = useMemo(()=>{
        return transactions.filter(tx => {const txDate = new Date(tx.date);
            month = txDate.toLocaleString("en-US", {
                month: "short"
            }).toLowerCase();
            if(selectedMonth !== "all"){
                const matchesMonth = month === selectedMonth?.toLowerCase();
                const matchesYear = txDate.getFullYear() === Number(selectedYear);
                return (
                    matchesMonth &&
                    matchesYear 
                );
            } else {
                return (
                    txDate <= new Date()
                );
            } 
        });
    },[timeFilter,selectedMonth,selectedYear,[]])

    const currentAnalayticalData = useMemo(()=>{
        return aggregatedData.filter(ag => {const agDate = new Date(ag.month);
            month = agDate.toLocaleString("en-US", {
                month: "short"
            }).toLowerCase();
            if(selectedMonth !== "all"){
                const matchesMonth = month === selectedMonth?.toLowerCase();
                const matchesYear = agDate.getFullYear() === Number(selectedYear);
                return (
                    matchesMonth &&
                    matchesYear 
                );
            } else {
                return (
                    agDate <= new Date()
                );
            } 
        });
    },[timeFilter,selectedMonth,selectedYear,[]])
    
    const analyticaldata = currentAnalayticalData.reduce((acc, curr) => {
        const existing = acc.find(
            item => item.category === curr.category
        );

        if (existing) {
            existing.income += curr.income;
            existing.expense += curr.expense;
        } else {
            acc.push({
            category: curr.category,
            income: curr.income,
            expense: curr.expense
            });
        }

        return acc;
    }, []);
    const expensesData = useMemo(()=>{
        return getAmountbyCategory(currentMonthData,true)
    },[currentMonthData]);
    const incomeData = useMemo(()=>{
        return getAmountbyCategory(currentMonthData,false)
    },[currentMonthData]);
    const totalExpenses = currentMonthData.filter(ag => ag.amount > 0 && !ag.pending).reduce((sum, ag) => sum + ag.amount, 0);
    const totalIncome = currentMonthData.filter(ag => ag.amount < 0 && !ag.pending).reduce((sum, ag) => sum + ag.amount, 0);

    return (
        <>
            {!loading && 
                <>
                    <div className="px-4 md:px-8 d-flex flex-col columns-2 md:flex-col columns-2 gap-4 md:gap-4 md:justify-between md:items-center">
                        <h2 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Analytics</h2>
                        <select className="w-full text-end" onChange={(e)=>setTimeFilter(e.target.value)} value={timeFilter}>
                            {time.map((t) =>(
                                <option key={t.split(" ")[0]} value={t.trim().toLowerCase()}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className="p-5">
                        <PlaidStats transactions={currentMonthData}/>
                    </div>
                    {analyticaldata && <AnalyticsChart data={currentAnalayticalData}/>}
                    <h3 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Category wise Expenses</h3>
                    <CategoryWiseData data={expensesData} total={totalExpenses}/>
                    <h3 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Category wise Income</h3>
                    <CategoryWiseData data={incomeData} total={totalIncome}/>
                </>
                
            }
        </>
       
    )
}

export default Analytics
