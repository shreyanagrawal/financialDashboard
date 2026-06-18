import React, {useState} from 'react'
import { useLocation, useNavigate } from "react-router-dom";
const EditBudget = () => {
    const location = useLocation();
    const { userId, budgets } = location.state || {};
    const [budgetList, setBudgetList] = useState(budgets || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempAmount, setTempAmount] = useState("");
    console.log(budgets);
    const handleEditClick = (index, currentAmount) => {
        setEditingIndex(index);
        setTempAmount(currentAmount);
    };
    const handleSaveClick = async (index) => {
        const updatedBudgets = [...budgetList];
        updatedBudgets[index].limit = Number(tempAmount);
        setBudgetList(updatedBudgets);
        setEditingIndex(null);
        // TODO: Add your API call here to update the database
    };
    const handleDeleteClick = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
        if (!confirmDelete) return;
        const budgetToDelete = budgetList[index];
        const updatedBudgets = budgetList.filter((_, i) => i !== index);
        setBudgetList(updatedBudgets);
        // TODO: Add your API call here to remove from the database
    };
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Budget</h2>
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                    &larr; Back to Dashboard
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700 w-1/3">Category</th>
                            <th className="p-4 font-semibold text-gray-700 w-1/4">Date</th>
                            <th className="p-4 font-semibold text-gray-700 w-1/3">Amount</th>
                            <th className="p-4 font-semibold text-gray-700 w-1/3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetList.map((budget, index) => (
                            <tr key={budget._id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-800 font-medium text-lg">
                                    {budget.category}
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                    {budget.month && budget.year ? `${budget.month}/${budget.year}` : "N/A"}
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
                                                value={tempAmount}
                                                onChange={(e) => setTempAmount(e.target.value)}
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
                                            <button onClick={() => handleSaveClick(index)} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                                                Save
                                            </button>
                                            <button onClick={() => setEditingIndex(null)} className="text-gray-400 font-semibold hover:text-gray-600 transition-colors">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditClick(index, budget.limit)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(index)} className="text-red-500 font-semibold hover:text-red-700 transition-colors">
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