import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

const getCategoryIcon = (category = "") => {
    const text = category.toLowerCase();

    if (text.includes("food") ||text.includes("drink") ||text.includes("restaurant"))
        return "☕";

    if (text.includes("shop") ||text.includes("shopping") ||text.includes("retail"))
        return "📦";

    if (text.includes("travel") ||text.includes("transport") ||text.includes("uber") ||text.includes("gas"))
        return "🚗";

    if (text.includes("entertainment") ||text.includes("movie") ||text.includes("music"))
        return "🎬";

    if (text.includes("salary") ||text.includes("payroll") ||text.includes("income"))
        return "💼";

    if (text.includes("utilities") ||text.includes("internet") ||text.includes("phone"))
        return "📡";

    if (text.includes("health") ||text.includes("medical") ||text.includes("pharmacy"))
        return "💊";

    if (text.includes("bank") || text.includes("transfer"))
        return "🏦";
    return "💳";
};

const Transactions = () => {
    const { userData } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric",});
    const [search, setSearch] = useState("");
    const loadTransactions = async () => {
        if (!userData?._id) return;
        try {
            const response = await axios.get(`http://localhost:3001/api/all-transactions/${userData._id}`,
                {
                    withCredentials: true,
                }
            );
            setTransactions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [userData]);
    const filtered = transactions.filter((tx) =>
        tx.name.toLowerCase().includes(search.toLowerCase())
    );
    const income = filtered
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const expenses = filtered
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
                
                {/* HEADER */}
                <div className="bg-white rounded-3xl shadow-sm p-5 sm:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* left */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Transactions</h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">{today}</p>
                        </div>
                        {/* search desktop only */}
                        <div className="hidden md:block w-full max-w-md">
                            <input type="text" placeholder="Search transactions..." value={search} onChange={(e) =>setSearch(e.target.value)}
                                className=" w-full border border-gray-200 rounded-2xl px-4 py-3 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"/>
                        </div>
                    </div>
                </div>
                
                {/* SUMMARY CARDS */}
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                    <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Transactions</p>
                        <h2 className="text-3xl font-bold mt-3">{filtered.length}</h2>
                        <p className="text-sm text-gray-400 mt-2">This month</p>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Income</p>
                        <h2 className="text-3xl font-bold text-green-600 mt-3">₹{income.toFixed(2)}</h2>
                    </div>
                    <div className="bg-white rounded-3xl p-5 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Expenses</p>
                        <h2 className="text-3xl font-bold text-red-500 mt-3">₹{expenses.toFixed(2)}</h2>
                    </div>
                </div>

                {/* TRANSACTION LIST */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-xl font-semibold">All Transactions</h2>
                    </div>
                    <div className="space-y-4">
                        {filtered.map((tx) => {
                            const category =
                                tx.category?.[0] || "Other";
                            const icon =
                                getCategoryIcon(category);
                            const expense =
                                tx.amount > 0;
                            return (
                                <div
                                    key={tx.transactionId}
                                    className=" flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-100 rounded-3xl px-4 py-4 hover:bg-slate-50 hover:shadow-sm transition">
                                    {/* LEFT */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">{icon}</div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{tx.merchantName || tx.name}</p>
                                            <p className="text-sm text-gray-500">{category}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="text-left sm:text-right">
                                        <p className={` text-lg font-bold ${expense? "text-red-500": "text-green-600"}`}>{expense ? "-" : "+"}₹ {Math.abs(tx.amount).toFixed(2)}</p>
                                        <p className="text-xs text-gray-400 mt-1 capitalize">
                                            {expense ? "Expense" : "Income"}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Transactions;