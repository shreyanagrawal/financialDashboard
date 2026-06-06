const Navbar = ({ open, ready, handleLogout, username }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg px-3 md:px-8 py-3 flex justify-between items-center rounded-b-2xl">
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold shadow-md">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h1 className="text-white text-sm md:text-xl font-bold truncate max-w-[100px] md:max-w-none">Hello, {username || "User"}</h1>
          <p className="text-blue-100 text-xs md:text-sm">Welcome back to your dashboard</p>
        </div>
      </div>
      <div className="flex gap-2 ">
        <button onClick={() => open()} disabled={!ready} className="text-xs md:text-sm bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200 shadow-md">Connect Bank</button>
        <button onClick={handleLogout} className="text-xs md:text-sm bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-md">Logout</button>
      </div>
    </div>
  );
};
export default Navbar;