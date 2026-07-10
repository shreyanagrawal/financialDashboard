import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { getTransactionsData, editTransaction, deleteTransaction } from '../utils/api';
const API_URL = import.meta.env.VITE_API_URL;
const EditTransactions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state || {};
    const [editingIndex, setEditingIndex] = useState(null);
    const [transactionList, setTransactionList] = useState([]);
    const initialTempData = {
        tempAmount: "",
        tempDate:"",
        tempMerchant:"",
        tempType:""
    }
    const [tempData, setTempData] = useState(initialTempData);
    const inititalPrevData ={
        prevDate:"",
        prevType:"",
        prevMerchant:""
    }
    const [prevData, setPrevData] = useState(inititalPrevData);
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
        loadTransactionData();
    },[userId])
    const loadTransactionData = async()=>{
        const transactionData = await getTransactionsData(userId);
        if(transactionData){
            const manualTransactions = transactionData.flatMap(
                doc => doc.manualTransactions || []
            );
            setTransactionList(manualTransactions)

        }
    }
    const handleEditClick = (index, transaction) => {
        setEditingIndex(index);
        setTempData({
            tempAmount: transaction.amount,
            tempDate: new Date(transaction.date).toISOString().split("T")[0],
            tempMerchant: transaction.merchant,
            tempType: transaction.type,
        });
        setPrevData({
            prevDate: transaction.date,
            prevType: transaction.type,
            prevMerchant: transaction.merchant
        });
    };
    const handleSaveClick = async (index) => {
        const editData = {
            prevType: prevData.prevType,
            type: tempData.tempType,
            category: transactionList[index].category,
            amount: Number(tempData.tempAmount),
            prevMerchant: prevData.prevMerchant,
            merchant: tempData.tempMerchant,
            prevDate: prevData.prevDate,
            date: tempData.tempDate,
        }
        const updatedData = await editTransaction(editData, userId);
        if(updatedData){
            setTransactionList(updatedData.data.manualTransactions);
            setMessage(updatedData.data.message);
            setEditingIndex(null);
        } else {
            setIsError(true);
            setMessage("Error updating transactions data");
        }
    };
    const handleDeleteClick = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return;
        const deleteData = {
            category: transactionList[index].category,
            date: transactionList[index].date,
            type: transactionList[index].type,
            merchant: transactionList[index].merchant
        }
        const updatedData = await deleteTransaction(deleteData, userId);
        if(updatedData){
            setTransactionList(updatedData.data.manualTransactions);
            setMessage(updatedData.data.message);
        }
        else {
            setIsError(true);
            setMessage("Error deleting record");
        }
    };
    return (
        <div className="px-4 pt-4 md:px-8 md:pt-8 pb-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Transactions</h2>
                <button 
                    onClick={() => navigate('/transactions')} 
                    className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                    &larr; Back to Transactions
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                {message && message !== '' && <div className={`p-4 mb-4 text-sm rounded-base ${isError ? "text-fg-danger-strong bg-danger-soft" : "text-fg-success-strong bg-success-soft"}`} role="alert"><p className="font-medium">{message}</p></div>}
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                        <tr>
                            <th className="p-4 font-semibold text-white w-1/5">Type</th>
                            <th className="p-4 font-semibold text-white w-1/4">Category</th>
                            <th className="p-4 font-semibold text-white w-1/5">Merchant</th>
                            <th className="p-4 font-semibold text-white w-1/5">Amount</th>
                            <th className="p-4 font-semibold text-white w-1/2">Date</th>
                            <th className="p-4 font-semibold text-white w-1/2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionList.map((transaction, index) => (
                            <tr key={transaction._id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-500 font-medium max-w-[80px]">
                                    {editingIndex === index ? (
                                        <select name="type" onChange={(e) => setTempData((prev)=>({...prev, tempType:e.target.value}))} value={tempData.tempType} className="border-2 border-blue-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full max-w-[80px]">
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    ) : (
                                        <span className="block max-w-[80px]">{transaction.type.replace(/\b\w/g, char => char.toUpperCase())}</span>

                                    )}
                                </td>
                                <td className="p-4 hover:cursor-pointer">
                                    <div className="group relative inline-block">
                                        <span className="block max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">{transaction.category.replace(/\b\w/g, char => char.toUpperCase())}</span>
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-sm px-2 py-1 rounded z-50 whitespace-nowrap hover:cursor-pointer">
                                            {transaction.category.replace(/\b\w/g, char => char.toUpperCase())}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={tempData.tempMerchant}
                                            onChange={(e) => setTempData((prev)=>({...prev, tempMerchant:e.target.value}))}
                                            className="border-2 border-blue-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full max-w-[140px]"
                                        />
                                    ) : (
                                        <span className="block">{transaction.merchant.replace(/\b\w/g, char => char.toUpperCase())}</span>
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
                                            ${Number(transaction.amount).toFixed(2)}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-500 font-medium whitespace-nowrap">
                                    {editingIndex === index ? (
                                        <input
                                            type="date"
                                            value={tempData.tempDate}
                                            onChange={(e) => setTempData((prev)=>({...prev, tempDate:e.target.value}))}
                                            className="border-2 border-blue-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full max-w-[140px]"
                                        />
                                    ) : (
                                        transaction.date ? `${new Date(transaction.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"})}` : "N/A"
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
                                            <button onClick={() => handleEditClick(index, transaction)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors cursor-pointer">
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
                        {transactionList.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">
                                    No transactions found. Add some from the dashboard!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EditTransactions