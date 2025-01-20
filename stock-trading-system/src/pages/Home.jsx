import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";

export default function Home({ darkMode, toggleDarkMode }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 overflow-auto">
        <h1>Home Page</h1>
      </div>
    </div>
  );
}
