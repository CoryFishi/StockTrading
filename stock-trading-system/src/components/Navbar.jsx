import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export default function Navbar({ darkMode, toggleDarkMode, setIsRegister }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 px-6 py-3 shadow-md transition-all ${
        isHome ? "bg-black text-white" : "bg-white dark:bg-zinc-900 text-black dark:text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-semibold">HedgeEdge</div>

        {/* Navigation Links + User Actions */}
        <div className="flex items-center space-x-4 text-sm font-medium">
          {user && (
            <>
              <Link
                to="/"
                className={`hover:underline ${
                  location.pathname === "/" ? "text-orchid" : ""
                }`}
              >
                Home
              </Link>
              {user && (
  <Link
    to="/dashboard"
    className={`hover:underline ${
      location.pathname === "/dashboard" ? "text-orchid" : ""
    }`}
  >
    Trading
  </Link>
)}
              {user.UserType === "Admin" && (
                <Link
                  to="/admin"
                  className={`hover:underline ${
                    location.pathname === "/admin" ? "text-orchid" : ""
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {/* Right side buttons */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-zinc-100 dark:bg-zinc-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {user.Email}
                {isDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 border rounded shadow-md z-50">
                  <button
                    onClick={toggleDarkMode}
                    className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            isHome && (
              <>
                <button
                  onClick={() => setIsRegister(false)}
                  className="px-4 py-1.5 rounded-full border-2 text-sm font-medium border-orchid text-orchid hover:bg-orchid hover:text-white transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => setIsRegister(true)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigoGlow text-white hover:bg-periwinkle transition"
                >
                  Sign up
                </button>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
