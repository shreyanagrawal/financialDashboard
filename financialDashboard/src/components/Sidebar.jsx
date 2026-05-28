import { Link } from "react-router-dom";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { name: "Dashboard", path: "/home",},
    { name: "Accounts", path: "/accounts",},
    { name: "Transactions", path: "/transactions",},
    { name: "Analytics",path: "/analytics",},
    { name: "Budgets", path: "/budgets",},
    { name: "Settings", path: "/settings",},
  ];
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}
      <div className={` fixed top-[98px] left-0 h-[calc(100vh-98px)] w-64 bg-white shadow-xl p-6 z-40 overflow-y-auto transform transition-transform duration-300 ${sidebarOpen   ? "translate-x-0"   : "-translate-x-full" } lg:translate-x-0`}>
      <h2 className="text-4xl font-bold text-blue-700 mb-10 ml-2">FinDash</h2>
      <div className="flex flex-col gap-5"> {menuItems.map((item) => ( 
        <Link 
          key={item.name} 
          to={item.path} 
          onClick={() => setSidebarOpen(false) } 
          className=" text-left px-4 py-3 rounded-2xl font-medium hover:bg-blue-50 hover:text-blue-700 transition">{item.name}
        </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;