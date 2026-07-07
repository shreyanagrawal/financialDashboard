import { useContext } from "react";
import { PlaidContext } from "../utils/PlaidContext";

const Navbar = ({ open, ready, handleLogout, username, loading }) => {
  const {isDataAvailable} = useContext(PlaidContext);
  return (
    <div className="sticky top-0 w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl" style={{"zIndex":99}}>
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        {!loading && <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold shadow-md">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div> }
        <div>
          {!loading && <>
            <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold break-all">Hello, {username || "User"}</h1>
            <p className="text-blue-100 text-sm">Welcome back to your dashboard</p>
          </>}
        </div>
      </div>
      <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
        <button onClick={() => open()} disabled={!ready} className="flex-1 md:flex-none bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200 shadow-md cursor-pointer">{isDataAvailable ? "Add Bank" : "Connect Bank"}</button>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
        {!loading && <button onClick={() => open()} disabled={!ready} className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200 shadow-md cursor-pointer">{isDataAvailable ? "Add Bank" : "Connect Bank"}</button>}
        <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-md cursor-pointer">Logout</button>
      </div>
    </div>
  );
};
export default Navbar;