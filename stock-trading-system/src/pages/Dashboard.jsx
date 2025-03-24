import MyStocks from "../components/MyStocks";
import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";
import TopStocks from "../components/TopStocks";
import UnderStocks from "../components/UnderStocks";

export default function Dashboard({
  darkMode,
  toggleDarkMode,
  stocks,
  loading,
}) {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Dashboard Content */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Performing Stocks */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            <MyStocks stocks={stocks} loading={loading} />
          </div>

          {/* Top Performing Stocks */}
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            <TopStocks stocks={stocks} loading={loading} />
          </div>

          {/* Underperforming Stocks */}
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            <UnderStocks stocks={stocks} loading={loading} />
          </div>

          {/* Stock Ticker */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            <StockTicker stocks={stocks} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
