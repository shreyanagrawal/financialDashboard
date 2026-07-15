import { useState } from "react";
import { submitTransactions } from "../utils/api";
import { Link } from "react-router-dom";
const AddTransactionModal = ({isOpen,setIsOpen,onClose,userId,transactions,setTransactions}) => {
    const [formData, setFormData] = useState({
        type: '',
        category: '',
        merchant: '',
        amount: '',
        date: ''
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const handleTransactions = await submitTransactions(formData, userId);
        setIsOpen(false);
        setTransactions(handleTransactions.transactions.transactions);
        setFormData({
            type: '',
            category: '',
            merchant: '',
            amount: '',
            date: ''
        });

    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 mt-20">
            <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Add Transaction</h2>
                    <button type="button" onClick={() => setIsOpen(false)} className="text-xl hover:text-red-500 transition cursor-pointer">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <label className="text-sm">Transaction Type</label>
                        <div>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" name="type" onClick={handleChange} value="expense" className={`py-3 rounded-xl border cursor-pointer transition ${formData.type === "expense" ? "bg-red-500 text-white border-red-500" : "bg-white/60 text-red-500 backdrop-blur-xl border border-gray-300 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"}`}>Expense</button>
                                <button type="button" name="type" onClick={handleChange} value="income" className={`py-3 rounded-xl border cursor-pointer transition ${formData.type === "income" ? "bg-green-500 text-white border-green-500" : "bg-white/60 text-green-500 backdrop-blur-xl border border-gray-300 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"}`}>Income</button>
                            </div>
                        </div>
                        <input type="text" placeholder="Merchant / Description e.g. Starbucks" value={formData.merchant} onChange={handleChange} name="merchant" className=" w-full border border-gray-300 rounded-xl px-4 py-3" />
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input type="number" placeholder="Amount 0.00" value={formData.amount} onChange={handleChange} name="amount" className=" w-full border border-gray-300 rounded-xl px-4 py-3" />
                            </div>
                            <div>
                                <select onChange={handleChange} value={formData.category} name="category" className=" w-full border border-gray-300 rounded-xl px-4 py-3">
                                    <option value="" disabled>Select Category</option>
                                    <option key={crypto.randomUUID()} value="food&dining">Food & Dining</option>
                                    <option key={crypto.randomUUID()} value="transport">Transport</option>
                                    <option key={crypto.randomUUID()} value="shopping">Shopping</option>
                                    <option key={crypto.randomUUID()} value="utilities">Utilities</option>
                                    <option key={crypto.randomUUID()} value="healthcare">Healthcare</option>
                                    <option key={crypto.randomUUID()} value="entertainment">Entertainment</option>
                                    <option key={crypto.randomUUID()} value="salary">Salary</option>
                                    <option key={crypto.randomUUID()} value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <label className="text-sm">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={()=>setIsOpen(false)} className=" border text-gray-700 hover:bg-gray-50 font-medium transition-colors py-3 px-4 rounded-xl cursor-pointer">Cancel</button>
                            <button className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 px-4 transition-colors cursor-pointer">Save</button>
                        </div>
                    </div>
                </form>
                <Link to="/editTransaction" state={{userId: userId,transactions: transactions}} className="text-blue-600 font-medium hover:text-blue-700 hover:underline text-sm flex items-center gap-1"> Edit Transactions</Link>
            </div>
        </div>
    );
};

export default AddTransactionModal;