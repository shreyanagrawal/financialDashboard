import React, { useContext } from "react";
import { PlaidContext } from "../utils/PlaidContext";
import { useLocation } from "react-router-dom";

const PlaidStats = ({ transactions = [], manualTransactions = [] }) => {
    const { accounts } = useContext(PlaidContext);
    const path = useLocation();

    // =============================
    // 1. NORMALIZE ALL TRANSACTIONS
    // =============================
    const allTransactions = [
        ...transactions,
        ...manualTransactions,
    ];

    const normalizedTransactions = allTransactions.map((tx) => {
        // BANK TRANSACTIONS (no type field)
        if (!tx.type) {
            return {
                ...tx,
                amount: Number(tx.amount),
            };
        }

        // MANUAL TRANSACTIONS
        return {
            ...tx,
            amount:
                tx.type === "expense"
                    ? -Math.abs(Number(tx.amount))
                    : Math.abs(Number(tx.amount)),
        };
    });

    // =============================
    // 2. TOTAL BALANCE (BANK ONLY)
    // =============================
    const totalBalance =
        accounts?.reduce((sum, item) => {
            return (
                sum +
                item.accounts.reduce(
                    (acc, account) =>
                        acc + (account.balances?.current || 0),
                    0
                )
            );
        }, 0) || 0;

    const connectedAccounts =
        accounts?.reduce(
            (total, item) => total + item.accounts.length,
            0
        ) || 0;

    // =============================
    // 3. CORE STATS
    // =============================
    const totalIncome = normalizedTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = normalizedTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const incomeCount = normalizedTransactions.filter(
        (t) => t.amount > 0
    ).length;

    const expenseCount = normalizedTransactions.filter(
        (t) => t.amount < 0
    ).length;

    const totalTransactions = normalizedTransactions.length;

    const creditsUsed =
        (accounts.length * 10) +
        (connectedAccounts * 2) +
        Math.floor(totalTransactions / 100);

    // =============================
    // UI
    // =============================
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* CARD 1 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname !== "/transactions" ? (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Total Balance
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">
                                ${Number(totalBalance).toLocaleString(
                                    "en-US",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Total Transactions
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">
                                {totalTransactions}
                            </p>
                        </>
                    )}
                </div>

                {/* CARD 2 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname === "/transactions" ? (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Total Income
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-green-600">
                                ${totalIncome.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-green-400 mt-2">
                                {incomeCount} transactions
                            </p>
                        </>
                    ) : path.pathname === "/accounts" ? (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Credits Used
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-500">
                                {creditsUsed}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Total Expenses
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-500">
                                ${totalExpenses.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </>
                    )}
                </div>

                {/* CARD 3 */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    {path.pathname === "/transactions" ? (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Total Expenses
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-red-600">
                                ${totalExpenses.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <p className="text-red-400 mt-2">
                                {expenseCount} transactions
                            </p>
                        </>
                    ) : path.pathname === "/home" ? (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Connected Banks
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">
                                {accounts.length}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-gray-500 text-sm mb-2">
                                Connected Accounts
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold text-blue-600">
                                {connectedAccounts}
                            </p>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PlaidStats;