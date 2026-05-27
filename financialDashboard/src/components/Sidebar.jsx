const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-50
          transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-10">FinDash</h2>
        <div className="flex flex-col gap-4">
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Dashboard</button>
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Accounts</button>
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Transactions</button>
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Analytics</button>
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Budgets</button>
          <button className="text-left px-4 py-3 rounded-xl hover:bg-blue-100 font-medium">Settings</button>
        </div>
      </div>
    </>
  );
};
export default Sidebar;