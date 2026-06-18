import React, { useContext, useState } from 'react'
import { PlaidContext } from '../utils/PlaidContext';
import { submitBuget } from '../utils/api';
import { Link } from "react-router-dom"

const AddBudgetModal = ({isOpen,setIsOpen,categories,userId,budgets}) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        month: '',
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const handleBudget = await submitBuget(formData, userId);
        setIsOpen(false);
        setFormData({
            category: '',
            amount: '',
            month: '',
        });
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Add Budget</h2>
                    <button onClick={() => setIsOpen(false)} className="text-xl text-gray-500">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Transaction Category</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 cursor-pointer shadow-sm transition-all" onChange={handleChange} value={formData.category} name="category">
                            <option key="all" value="" selected disabled>Select Option</option>
                            {categories.map((filter)=>{
                                return <option key={crypto.randomUUID()} value={filter.split("*//")[0].toLowerCase()}>{filter}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter Budget Amount" className="w-full border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all  " required/>
                    </div>
                    <div>
                        <input type="month" name="month" value={formData.month} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all" required placeholder="Enter Month"/>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">Save Budget</button>
                    </div>
                </form>
                <Link to="/editbudget" state={{userId: userId,budgets: budgets}}><span className="text-left px-4 py-3 rounded-xl font-medium hover:underline">Edit Budget</span></Link>
            </div>
        </div>
    );
};
export default AddBudgetModal
