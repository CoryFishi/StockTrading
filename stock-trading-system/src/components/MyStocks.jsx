import { useState, useEffect } from "react";
import PaginationFooter from "./PaginationFooter";

const MyStocks = ({ stocks }) => {
  // Declarations and initial state
  // fake user stocks data for testing
  // In a real application, this data would come from an API or database
  const [myStocks, setMyStocks] = useState([
    { Ticker: "AAPL", CompanyName: "Apple", shares: 10, purchasePrice: 140 },
    { Ticker: "BBL", CompanyName: "Jesus", shares: 10, purchasePrice: 120 },
    {
      Ticker: "MSFT",
      CompanyName: "Microsoft",
      shares: 15,
      purchasePrice: 280,
    },
    {
      Ticker: "GOOGL",
      CompanyName: "Alphabet",
      shares: 8,
      purchasePrice: 2500,
    },
    { Ticker: "AMZN", CompanyName: "Amazon", shares: 5, purchasePrice: 3300 },
    { Ticker: "TSLA", CompanyName: "Tesla", shares: 12, purchasePrice: 700 },
    { Ticker: "NFLX", CompanyName: "Netflix", shares: 7, purchasePrice: 500 },
    { Ticker: "NVDA", CompanyName: "NVIDIA", shares: 10, purchasePrice: 220 },
    { Ticker: "META", CompanyName: "Meta", shares: 9, purchasePrice: 330 },
    { Ticker: "BABA", CompanyName: "Alibaba", shares: 14, purchasePrice: 180 },
    { Ticker: "INTC", CompanyName: "Intel", shares: 20, purchasePrice: 60 },
    { Ticker: "AMD", CompanyName: "AMD", shares: 16, purchasePrice: 90 },
    { Ticker: "ORCL", CompanyName: "Oracle", shares: 13, purchasePrice: 85 },
    { Ticker: "CSCO", CompanyName: "Cisco", shares: 18, purchasePrice: 55 },
    { Ticker: "ADBE", CompanyName: "Adobe", shares: 6, purchasePrice: 480 },
    {
      Ticker: "CRM",
      CompanyName: "Salesforce",
      shares: 11,
      purchasePrice: 210,
    },
    { Ticker: "SHOP", CompanyName: "Shopify", shares: 7, purchasePrice: 1450 },
    { Ticker: "UBER", CompanyName: "Uber", shares: 25, purchasePrice: 45 },
    { Ticker: "LYFT", CompanyName: "Lyft", shares: 30, purchasePrice: 50 },
    { Ticker: "SQ", CompanyName: "Block", shares: 10, purchasePrice: 240 },
  ]);
  const [filteredStocks, setFilteredStocks] = useState(myStocks);
  const [searchTerm, setSearchTerm] = useState("");

  // pagination and sorting logic
  const [currentPrices, setCurrentPrices] = useState({});
  const [totalGainLoss, setTotalGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "gainLossPercentage",
    direction: "asc",
  });
  const [stocksPerPage, setStocksPerPage] = useState(5);
  const filtered = myStocks.filter(
    (stock) =>
      stock.Ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedStocks = filtered
    .map((stock) => {
      const currentPrice =
        parseFloat(currentPrices[stock.Ticker]) || stock.purchasePrice;
      const gainLossPercentage =
        ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
      console.log(
        `Ticker: ${stock.Ticker}, Current Price: ${currentPrice}, Gain/Loss Percentage: ${gainLossPercentage}`
      );
      return {
        ...stock,
        currentPrice: Number(currentPrice.toFixed(2)),
        gainLossPercentage: Number(gainLossPercentage.toFixed(2)),
      };
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Effect to update current prices based on the stocks prop
  // This effect runs whenever the stocks prop changes
  useEffect(() => {
    const pricesMap = stocks.reduce((acc, stock) => {
      acc[stock.Ticker] = parseFloat(stock.CurrentPrice) || 0;
      return acc;
    }, {});
    setCurrentPrices(pricesMap);
  }, [stocks]);

  // Effect to calculate total gain/loss and current value
  // This effect runs whenever myStocks or currentPrices change
  useEffect(() => {
    if (myStocks.length > 0) {
      let totalPurchaseValue = 0;
      let totalCurrentValue = 0;

      myStocks.forEach((stock) => {
        const currentPrice =
          parseFloat(currentPrices[stock.Ticker]) || stock.purchasePrice;
        totalPurchaseValue += stock.purchasePrice * stock.shares;
        totalCurrentValue += currentPrice * stock.shares;
      });

      const totalGainLossValue = totalCurrentValue - totalPurchaseValue;
      const totalGainLossPercentage =
        (totalGainLossValue / totalPurchaseValue) * 100;

      setTotalGainLoss({
        value: totalGainLossValue,
        percentage: totalGainLossPercentage,
      });

      setTotalCurrentValue(totalCurrentValue);
    }
  }, [myStocks, currentPrices]);

  return (
    <div className="w-full mx-auto bg-white dark:bg-zinc-800 rounded-lg p-1 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        {/* Header */}
        <div className="flex items-center space-x-7">
          <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            My Stocks
          </h2>
          <input
            className="w-96 px-2 py-1 rounded border text-black"
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Total Gain/Loss and Current Value */}
        <div>
          <p
            className={`text-2xl font-bold ${
              totalGainLoss.value > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {totalGainLoss.value > 0 ? "+" : ""}$
            {totalGainLoss.value.toFixed(2)} (
            {totalGainLoss.percentage.toFixed(2)}%)
          </p>
          <p className="text-lg text-zinc-800 dark:text-zinc-100 text-right">
            ${totalCurrentValue.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Table for displaying stocks */}
      <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700 mb-5">
        <thead className="select-none cursor-pointer">
          <tr className="bg-zinc-200 dark:bg-zinc-700">
            <th
              onClick={() => handleSort("Ticker")}
              className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
            >
              {sortConfig.key === "Ticker" &&
                (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
              Ticker
            </th>
            <th
              onClick={() => handleSort("CompanyName")}
              className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
            >
              {sortConfig.key === "CompanyName" &&
                (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
              Company
            </th>
            <th
              onClick={() => handleSort("shares")}
              className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
            >
              {sortConfig.key === "shares" &&
                (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
              Shares
            </th>
            <th
              onClick={() => handleSort("currentPrice")}
              className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
            >
              {sortConfig.key === "currentPrice" &&
                (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
              Current Price
            </th>
            <th
              onClick={() => handleSort("gainLossPercentage")}
              className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
            >
              {sortConfig.key === "gainLossPercentage" &&
                (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
              Gain/Loss (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks
            .slice(
              (currentPage - 1) * stocksPerPage,
              currentPage * stocksPerPage
            )
            .map((stock, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-100 text-center cursor-pointer"
                onClick={() => console.log("Open stock details")}
              >
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  {stock.Ticker}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  {stock.CompanyName}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  {stock.shares}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  ${stock.currentPrice.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-2 font-bold border border-zinc-300 dark:border-zinc-600 ${
                    stock.gainLossPercentage > -0.00001
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stock.gainLossPercentage.toFixed(2) + "%"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Pagination */}
      {/* Only show pagination if there are more stocks than can fit on one page */}
      <PaginationFooter
        rowsPerPage={stocksPerPage}
        setRowsPerPage={setStocksPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        items={sortedStocks}
      />
    </div>
  );
};

export default MyStocks;
