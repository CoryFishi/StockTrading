import AddStockForm from "../components/AddStockForm";
import HomeComp from "../components/HomeComp";
import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";

export default function Home({ darkMode, toggleDarkMode }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 overflow-auto">
        <HomeComp />
      </div>
    </div>
  );
}
