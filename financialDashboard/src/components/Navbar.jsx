const Navbar = ({ open, ready, handleLogout, username }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-25 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-lg px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between gap-5 sm:items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-xl shadow">{username? username.charAt(0).toUpperCase(): "U"}</div>
          <div>
            <h1 className="text-white text-lg sm:text-2xl font-bold">Hello, {username || "User"} </h1>
            <p className="text-blue-100 text-sm">Welcome back</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => open()} disabled={!ready} className="bg-white text-blue-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">Connect Bank</button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition">Logout</button>
        </div>
      </div>
    </div>
  );
};
export default Navbar;