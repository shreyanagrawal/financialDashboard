const Navbar = ({ open, ready, handleLogout, username }) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg px-8 py-4 flex justify-between items-center rounded-b-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold shadow-md">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Hello, {username || "User"}</h1>
          <p className="text-blue-100 text-sm">Welcome back to your dashboard</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => open()}
          disabled={!ready}
          className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-200 shadow-md"
        >Connect Bank</button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 hover:scale-105 transition duration-200 shadow-md"
        >Logout</button>
      </div>
    </div>
  );
};
export default Navbar;