import { Link } from "react-router-dom";
import { RiMenuFold3Fill, RiMenuFold4Fill } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, toggleDarkMode }) {
  // Toggle dark mode and save preference to localStorage
  const toggleSideMenu = () => {
    setDashboardMenu((prev) => !prev);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const [dashboardMenu, setDashboardMenu] = useState(false);

  const handleLogout = async () => {};

  const showSideToggle = location.pathname === "/";

  // Close modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the modal
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white dark:bg-slate-700 p-2 w-full border-slate-200 dark:border-gray-700 border-b select-none relative">
      <div className="flex items-center justify-between text-black dark:text-white relative">
        <div className="flex">
          {showSideToggle && (
            <button
              onClick={toggleSideMenu}
              className="flex items-center flex-shrink-0 p-2"
            >
              {(dashboardMenu === true && (
                <RiMenuFold3Fill className="text-2xl ml-1 hover:cursor-pointer" />
              )) || (
                <RiMenuFold4Fill className="text-2xl ml-1 hover:cursor-pointer" />
              )}
            </button>
          )}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-medium">
          HedgeEdge
        </div>
        <div className="flex space-x-4 items-center mr-5">
          <Link
            to="/"
            className={`hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium ${
              location.pathname === "/" ? "border-b-2 border-blue-400" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium ${
              location.pathname === "/dashboard"
                ? "border-b-2 border-blue-400"
                : ""
            }`}
          >
            Trading
          </Link>

          <Link
            to="/admin"
            className={`hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium ${
              location.pathname === "/admin" ? "border-b-2 border-blue-400" : ""
            }`}
          >
            Admin
          </Link>

          {true ? (
            <div className="relative" ref={userRef}>
              <h2
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer bg-gray-100 dark:bg-slate-500 rounded-md p-2 px-4 flex items-center text-center"
              >
                email@gmail.com{" "}
                {isDropdownOpen ? <MdExpandLess /> : <MdExpandMore />}
              </h2>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white dark:bg-slate-500 border border-gray-200 dark:border-slate-400 rounded-lg shadow-lg p-2 z-20 flex flex-col">
                  <button
                    className="hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium text-center"
                    onClick={() =>
                      toggleDarkMode() & setIsDropdownOpen(!isDropdownOpen)
                    }
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <Link
                    to="/account"
                    className="hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium text-center border-t border-t-gray-100 dark:border-t-border"
                  >
                    Account
                  </Link>
                  <button
                    className="hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 text-md font-medium border-opacity-50 border-t border-t-gray-100 dark:border-t-border"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`hover:bg-slate-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-md font-medium ${
                location.pathname === "/" ? "underline" : ""
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
