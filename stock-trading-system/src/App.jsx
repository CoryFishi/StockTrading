import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import StockTicker from "./components/StockTicker";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import { io } from "socket.io-client";
import API_BASE_URL from "./config.js";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  // Check localStorage for dark mode preference on initial render
  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/data`);
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStocks();

    // Connect to the Socket.IO server
    const socket = io("http://3.90.131.54:4000");

    // Listen for real-time updates
    socket.on("stockUpdate", (updatedStocks) => {
      setStocks(updatedStocks);
    });

    // Clean up the socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              stocks={stocks}
              loading={loading}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/register"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/admin"
          element={
            <Admin darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/account"
          element={
            <Account darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/*"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
      </Routes>
    </>
  );
}
