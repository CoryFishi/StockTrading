import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import StockTicker from "./components/StockTicker";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
            <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
