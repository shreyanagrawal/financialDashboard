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
            if (selectedMonth !== "all"){
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
                <div className="px-4 md:px-8 flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <h2 className="text-2xl font-semibold m-0">Budgets</h2>
                    <div className="relative w-full md:w-56">
                        <select 
                            className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-xl font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all" 
                            onChange={(e) => setTimeFilter(e.target.value)} 
                            value={timeFilter}
                        >
                            {time.map((t) =>(
                                <option key={t.split(" ")[0]} value={t.trim().toLowerCase()}>{t}</option>
                             ))}
                         </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <CategoryWiseData data={actualBudget} total={totalExpenses}/>
                <div className="px-4 md:px-8 flex flex-row rows-2 md:flex-row rows-2 gap-4 md:gap-4 md:justify-between md:items-center">
                    <h2 className="pt-0 text-2xl font-semibold" style={{paddingBottom: 0}}>Expected v/s Actual Budget Analysis</h2>
                    <button className="text-end bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2 rounded-xl font-semibold text-white cursor-pointer" onClick={()=>setIsOpen(true)}>Add Budget</button>
                </div>
                {isOpen && <AddBudgetModal isOpen={isOpen} setIsOpen={setIsOpen} categories={categories} userId={userData._id} budgets={budget} setBudget={setBudget}/>}
                {budget && <BudgetChart chart={getActualVsExpected(actualBudget, budget)}/>}
            </>
            }
        </>
        
    )
}
export default Budget
