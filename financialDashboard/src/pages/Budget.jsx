import React, { useEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import { PlaidContext } from '../utils/PlaidContext'
import AddBudgetModal from '../components/AddBudgetModal';
import { AuthContext } from '../utils/AuthContext';
import { getAmountbyCategory, getBudgets } from '../utils/api';
import BudgetChart from '../components/BudgetChart';
import CategoryWiseData from '../components/CategoryWiseData';

const Budget = () => {
    const [timeFilter,setTimeFilter] = useState();
    const {transactions, setTransactions} = useContext(PlaidContext);
    const {userData, loading, setLoading} = useContext(AuthContext);
    const [budget, setBudget] = useState([]);
    let categories = [];
    const [isOpen,setIsOpen] = useState(false);
    const time = ['All', ...new Set(transactions.map((tx) => {
        const txDate = new Date(tx.date);
        return txDate.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
        });
    }))];
    const selectedMonth = timeFilter ? timeFilter?.split(" ")[0] : "all"; 
    const selectedYear = timeFilter?.split(" ")[1] ;
    let month = '';
    const currentMonthExpenses = useMemo(()=>{
        return transactions.filter(tx => {const txDate = new Date(tx.date);
            month = txDate.toLocaleString("en-US", {
                month: "short"
            }).toLowerCase();
            if(selectedMonth !== "all"){
                const matchesMonth = month === selectedMonth.toLowerCase();
                const matchesYear = txDate.getFullYear() === Number(selectedYear);
                return (
                    matchesMonth &&
                    matchesYear &&
                    Number(tx.amount) > 0
                );
            } else {
                return (
                    txDate <= new Date() &&
                    Number(tx.amount) > 0
                );
            } 
        });
    },[timeFilter,selectedMonth,selectedYear,[]])
    const totalExpenses = currentMonthExpenses.filter(tx => tx.amount > 0 && !tx.pending).reduce((sum, tx) => sum + tx.amount, 0);
    const actualBudget = useMemo(() => {
        return getAmountbyCategory(currentMonthExpenses, true);
    }, [currentMonthExpenses]);

    categories = Object.keys(actualBudget);
    useEffect(()=>{
        getBudgetData();
    },[userData]);
    const getBudgetData = async()=>{
        if(userData){
            const budgetData = await getBudgets(userData._id);
            if(budgetData)
                setBudget(budgetData)
        }
    }
    useEffect(()=>{
        if(time.length >0 ) 
            setTimeout(()=>{setLoading(false)
            },1000);
    },[time]);
    const getActualVsExpected = (actualBudget, budgets) => {
        return budgets.filter((budget) => {
            if (selectedMonth){
                const monthName = new Date(budget.year,budget.month - 1).toLocaleString("en-US", {
                    month: "short",
                }).toLowerCase();
                return (monthName === selectedMonth?.toLowerCase() && Number(selectedYear) === Number(budget.year));
            } else {
                return new Date(budget.year,budget.month - 1) <= new Date()
            }
        }).map((budget) => {
            const actual = Object.entries(actualBudget).filter(([name]) =>
                name.toLowerCase().includes(budget.category.toLowerCase())
            ).reduce((sum, [, amount]) => sum + amount, 0);
            return {
                category: budget.category,
                expected: budget.limit,
                actual: Number(actual.toFixed(2)),
            };
        });
    };
    return (
        <>
            {!loading && 
                <>
                <div className="px-4 md:px-8 d-flex flex-col columns-2 md:flex-col columns-2 gap-4 md:gap-4 md:justify-between md:items-center">
                    <h2 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Budgets</h2>
                    <select className="w-full text-end" onChange={(e)=>setTimeFilter(e.target.value)} value={timeFilter}>
                        {time.map((t) =>(
                            <option key={t.split(" ")[0]} value={t.trim().toLowerCase()}>{t}</option>
                        ))}
                    </select>
                </div>
                <CategoryWiseData data={actualBudget} total={totalExpenses}/>
                <div className="px-4 md:px-8 flex flex-row rows-2 md:flex-row rows-2 gap-4 md:gap-4 md:justify-between md:items-center">
                    <h2 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Expected v/s Actual Budget Analysis</h2>
                    <button className="text-end bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2 rounded-xl font-semibold text-white cursor-pointer" onClick={()=>setIsOpen(true)}>Add Budget</button>
                </div>
                {isOpen && <AddBudgetModal isOpen={isOpen} setIsOpen={setIsOpen} categories={categories} userId={userData._id} budgets={budget}/>}
                {budget && <BudgetChart chart={getActualVsExpected(actualBudget, budget)}/>}
            </>
            }
        </>
        
    )
}
export default Budget
