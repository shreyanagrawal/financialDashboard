import React from "react";

const ManualTransactionsList = ({ transactions }) => {
  return (
      <div className="bg-white rounded-2xl shadow-md h-full flex flex-col">
          <div className="px-8 py-4 border-b border-slate-600 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-tr-2xl rounded-tl-2xl shrink-0">
            <h2 className="text-white text-sm">Manual Transactions</h2></div>
          <div className="px-8 pb-8 overflow-y-auto flex-1">
        {transactions?.map((tx) => (
          <div
            key={tx._id}
            className="flex justify-between px-2 pt-3 pb-1 border-b border-slate-200 last:border-b-0"
          >
            <div>
              <p className="text-gray-500 text-sm">
                {tx.merchant}
              </p>

              <p className="text-gray-500 text-xs">
                {tx.category}
              </p>
            </div>

            <div>
              <p
                className={`text-sm font-semibold ${
                  tx.type === "expense"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {tx.type === "expense" ? "-" : "+"}$
                {Number(tx.amount).toFixed(2)}
              </p>

              <p className="text-gray-500 text-xs text-right">
                {new Date(tx.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualTransactionsList;