const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-4 md:p-8 text-white shadow-lg mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">Personal Finance Dashboard</h1>
          <p className="text-blue-100 text-sm md:text-lg">Track your spending, manage budgets, and monitor your financial health.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2">Total Balance</h2>
            <p className="text-2xl md:text-3xl font-bold text-green-600">₹0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2"> Monthly Expenses</h2>
            <p className="text-2xl md:text-3xl font-bold text-red-500">₹0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm mb-2">Connected Accounts</h2>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>
        <div className="mt-10 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">Transactions and analytics will appear here once a bank account is connected.</p>
        </div>
      </div>
    </div>
  );
};
export default Home;