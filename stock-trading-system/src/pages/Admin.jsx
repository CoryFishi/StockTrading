import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";
import AddStockForm from "../components/AddStockForm";
import DeleteStock from "../components/DeleteStock";

export default function Admin({ darkMode, toggleDarkMode }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 overflow-auto">
        <AddStockForm />
        <DeleteStock />
      </div>
    </div>
  );
}
