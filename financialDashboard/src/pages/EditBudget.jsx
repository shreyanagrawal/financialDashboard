import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { deleteBudget, editBudget, getBudgets } from '../utils/api';
const API_URL = import.meta.env.VITE_API_URL;
const EditBudget = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state || {};
    const [editingIndex, setEditingIndex] = useState(null);
    const [budgetList, setBudgetList] = useState([]);
    const initialTempData = {
        tempAmount: "",
        tempDate: "",
    };
    const [tempData, setTempData] = useState(initialTempData);
    const initialPrevData = {
        prevMonth: "",
        prevYear: ""
    };
    const [prevData, setPrevData] = useState(initialPrevData);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    useEffect(()=>{
        if(message !== ''){
        setTimeout(()=>{
            setMessage("")
        },1000);
        }
    },[message])
    useEffect(()=>{
        loadBudgetData();
    },[userId])
    const loadBudgetData = async()=>{
        const budgetData = await getBudgets(userId);
        if(budgetData)
            setBudgetList(budgetData)
    }
    const handleEditClick = (index, budget) => {
        setEditingIndex(index);
        setTempData({
            tempAmount: budget.limit,
            tempDate: budget.year && budget.month ? `${budget.year}-${budget.month.toString().padStart(2, '0')}` : (""),
        });
        setPrevData({
            prevMonth: budget.month,
            prevYear: budget.year
        })
    };
    const handleSaveClick = async (index) => {
        const editData = {
            category: budgetList[index].category,
            limit: Number(tempData.tempAmount),
            prevMonth: prevData.prevMonth,
            prevYear: prevData.prevYear,
            month: Number(tempData.tempDate.split('-')[1]),
            year: Number(tempData.tempDate.split('-')[0])
        }
        const updatedData = await editBudget(editData, userId);
        if(updatedData){
            setBudgetList(updatedData.data.budgets);
            setMessage(updatedData.data.message);
            setEditingIndex(null);
        } else {
            setIsError(true);
            setMessage("Error updating budget data");
        }
    };
    const handleDeleteClick = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
        if (!confirmDelete) return;
        const deleteData = {
            category: budgetList[index].category,
            month: Number(budgetList[index].month),
            year: Number(budgetList[index].year),
        }
        const updatedData = await deleteBudget(deleteData, userId);
        if(updatedData){
            setBudgetList(updatedData.data.budgets);
            setMessage(updatedData.data.message);
        }
        else {
            setIsError(true);
            setMessage("Error updating profile");
        }
    };
    return (
        <div className="px-4 pt-4 md:px-8 md:pt-8 pb-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Budget</h2>
                <button 
                    onClick={() => navigate('/budget')} 
                    className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                    &larr; Back to Budgets
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                {message && message !== '' && <div className={`p-4 mb-4 text-sm rounded-base ${isError ? "text-fg-danger-strong bg-danger-soft" : "text-fg-success-strong bg-success-soft"}`} role="alert"><p className="font-medium">{message}</p></div>}
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                        <tr>
                            <th className="p-4 font-semibold text-white w-1/3">Category</th>
                            <th className="p-4 font-semibold text-white w-1/4">Date</th>
                            <th className="p-4 font-semibold text-white w-1/3">Amount</th>
                            <th className="p-4 font-semibold text-white w-1/3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetList.map((budget, index) => (
                            <tr key={budget._id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4 hover:cursor-pointer">
                                    <div className="group relative inline-block">
                                        <span className="block max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">{budget.category.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-sm px-2 py-1 rounded z-50 whitespace-nowrap hover:cursor-pointer">
                                            {budget.category.replace(/\b\w/g, char => char.toUpperCase())}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                    {editingIndex === index ? (
                                        <input
                                            type="month"
                                            value={tempData.tempDate}
                                            onChange={(e) => setTempData((prev)=>({...prev, tempDate: e.target.value}))}
                                            className="border-2 border-blue-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full max-w-[140px]"
                                        />
                                    ) : (
                                        budget.month && budget.year ? `${new Date(budget.year,budget.month - 1).toLocaleString("en-US", {month: "short"})} ${budget.year}` : "N/A"
                                    )}
                                </td>
                                <td className="p-4">
                                    {editingIndex === index ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="border-2 border-blue-400 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                value={tempData.tempAmount}
                                                onChange={(e) => setTempData((prev)=>({...prev, tempAmount:e.target.value}))}
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-600 font-medium">
                                            ${Number(budget.limit).toFixed(2)}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 flex gap-4 justify-end">
                                    {editingIndex === index ? (
                                        <>
                                            <button onClick={()=>handleSaveClick(index)} className="text-green-600 font-semibold hover:text-green-700 transition-colors cursor-pointer">
                                                Save
                                            </button>
                                            <button onClick={() => setEditingIndex(null)} className="text-gray-400 font-semibold hover:text-red-600 transition-colors cursor-pointer">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(index, budget)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors cursor-pointer">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(index)} className="text-red-500 font-semibold hover:text-red-700 transition-colors cursor-pointer">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {budgetList.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">
                                    No budgets found. Add some from the dashboard!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EditBudget