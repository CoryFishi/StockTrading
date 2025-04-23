import { useState, useEffect } from "react";

const MyStocks = ({ stocks }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [myStocks, setMyStocks] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [totalGainLoss, setTotalGainLoss] = useState({ value: 0, percentage: 0 });
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAscending, setSortAscending] = useState(true);

  const stocksPerPage = 5;
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/portfolio/${user.userID}`);
        const data = await res.json();
        setMyStocks(
          data.map((entry) => ({
            ticker: entry.Ticker,
            company: entry.CompanyName,
            shares: entry.Quantity,
            purchasePrice: parseFloat(entry.AveragePrice),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      }
    };

    fetchPortfolio();
  }, [user]);

  useEffect(() => {
    const pricesMap = stocks.reduce((acc, stock) => {
      acc[stock.Ticker] = stock.CurrentPrice || 0;
      return acc;
    }, {});
    setCurrentPrices(pricesMap);
  }, [stocks]);

  useEffect(() => {
    if (myStocks.length > 0) {
      let totalPurchaseValue = 0;
      let totalValue = 0;

      myStocks.forEach((stock) => {
        const currentPrice = parseFloat(currentPrices[stock.ticker]) || stock.purchasePrice;
        totalPurchaseValue += stock.purchasePrice * stock.shares;
        totalValue += currentPrice * stock.shares;
      });

      const totalGainLossValue = totalValue - totalPurchaseValue;
      const totalGainLossPercentage = (totalGainLossValue / totalPurchaseValue) * 100;

      setTotalGainLoss({ value: totalGainLossValue, percentage: totalGainLossPercentage });
      setTotalCurrentValue(totalValue);
    }
  }, [myStocks, currentPrices]);

  const sortedStocks = myStocks
    .map((stock) => {
      const currentPrice = parseFloat(currentPrices[stock.ticker]) || stock.purchasePrice;
      const gainLossPercentage = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
      return { ...stock, currentPrice, gainLossPercentage };
    })
    .sort((a, b) =>
      sortAscending
        ? b.gainLossPercentage - a.gainLossPercentage
        : a.gainLossPercentage - b.gainLossPercentage
    );

  const currentStocks = sortedStocks.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(myStocks.length / stocksPerPage);

  return (
    <div className="w-full mx-auto bg-white dark:bg-zinc-800 rounded-lg p-1 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">My Stocks</h2>
        <div>
          <p className={`text-2xl font-bold ${totalGainLoss.value > 0 ? "text-green-500" : "text-red-500"}`}>
            {totalGainLoss.value > 0 ? "+" : ""}${totalGainLoss.value.toFixed(2)} (
            {totalGainLoss.percentage.toFixed(2)}%)
          </p>
          <p className="text-lg text-zinc-800 dark:text-zinc-100 text-right">${totalCurrentValue.toFixed(2)}</p>
        </div>
      </div>
      <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700">
        <thead>
          <tr className="bg-zinc-200 dark:bg-zinc-700">
            <th className="px-4 py-2">Ticker</th>
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">Shares</th>
            <th className="px-4 py-2">Current Price</th>
            <th onClick={() => setSortAscending(!sortAscending)} className="px-4 py-2 cursor-pointer">
              {sortAscending ? "↓" : "↑"} Gain/Loss (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentStocks.map((stock) => (
            <tr key={stock.ticker} className="hover:bg-blue-50 dark:hover:bg-zinc-600 text-center">
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">{stock.ticker}</td>
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">{stock.company}</td>
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">{stock.shares}</td>
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">${stock.currentPrice.toFixed(2)}</td>
              <td
                className={`px-4 py-2 font-bold border border-zinc-300 dark:border-zinc-700 ${
                  stock.gainLossPercentage > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock.gainLossPercentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-zinc-200 text-black hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStocks;