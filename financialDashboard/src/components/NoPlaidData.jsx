import { Landmark } from "lucide-react";

const NoPlaidData = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-10 text-center">
      <div className="flex justify-center mb-4">
        <Landmark className="w-14 h-14 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold mb-3">
        No Bank Account Connected
      </h2>

      <p className="text-gray-500 max-w-md mx-auto">
        Connect a bank account through Plaid to view balances,
        transactions, analytics and financial insights.
      </p>
    </div>
  );
};

export default NoPlaidData;