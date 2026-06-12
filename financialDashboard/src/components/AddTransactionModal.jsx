import { useState } from "react";
const AddTransactionModal = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [type, setType] = useState("expense");
    const [merchant, setMerchant] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food & Dining");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    if (!isOpen) return null;
    const handleSubmit = () => {
        if (!merchant.trim()) {
            alert("Merchant is required");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            alert("Amount must be greater than 0");
            return;
        }
        onSave({
            type,
            merchant,
            amount: Number(amount),
            category,
            date,
        });
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 w-[420px] max-w-[95vw] shadow-2xl border border-white/20 text-white">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Add Transaction</h2>
                    <button onClick={onClose} className="text-white/70 text-xl hover:text-white transition">×</button>
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-sm text-blue-100">Transaction Type</label>
                    <div>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setType("expense")} className={`py-3 rounded-xl border transition ${type === "expense"? "bg-red-500 text-white border-red-500": "bg-white/10 text-white border-white/20"}`}>Expense</button>
                            <button type="button" onClick={() => setType("income")} className={`py-3 rounded-xl border transition ${type === "income" ? "bg-green-500 text-white border-green-500": "bg-white/10 text-white border-white/20"}`}>Income</button>
                        </div>
                    </div>
                    <label className="text-sm text-blue-100">Merchant / Description</label>
                    <input type="text" placeholder="e.g. Starbucks" value={merchant} onChange={(e) => setMerchant(e.target.value)} className=" w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50"/>
                    <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-blue-100 block mb-2">Amount</label>
                        <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className=" w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50"/>
                    </div>
                    <div>
                        <label className="text-sm text-blue-100 block mb-2">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className=" w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
                                <option className="bg-indigo-600 text-white">Food & Dining</option>
                                <option className="bg-indigo-600 text-white">Transport</option>
                                <option className="bg-indigo-600 text-white">Shopping</option>
                                <option className="bg-indigo-600 text-white">Utilities</option>
                                <option className="bg-indigo-600 text-white">Healthcare</option>
                                <option className="bg-indigo-600 text-white">Entertainment</option>
                                <option className="bg-indigo-600 text-white">Salary</option>
                                <option className="bg-indigo-600 text-white">Other</option>
                            </select>
                        </div>
                    </div>
                    <label className="text-sm text-blue-100">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50"/>
                    <div className="flex gap-3">
                        <button onClick={onClose} className=" flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-xl">Cancel</button>
                        <button onClick={handleSubmit} className=" flex-1 bg-white text-blue-700 font-semibold py-3 rounded-xl hover:scale-105 transition">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;