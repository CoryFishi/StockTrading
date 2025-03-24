import { useState, useEffect } from "react";

const MyStocks = ({ stocks }) => {
  // Declarations and initial state
  // fake user stocks data for testing
  // In a real application, this data would come from an API or database
  const [myStocks, setMyStocks] = useState([
    { ticker: "AAPL", company: "Apple", shares: 10, purchasePrice: 140 },
    { ticker: "BBL", company: "Jesus", shares: 10, purchasePrice: 120 },
    { ticker: "MSFT", company: "Microsoft", shares: 15, purchasePrice: 280 },
    { ticker: "GOOGL", company: "Alphabet", shares: 8, purchasePrice: 2500 },
    { ticker: "AMZN", company: "Amazon", shares: 5, purchasePrice: 3300 },
    { ticker: "TSLA", company: "Tesla", shares: 12, purchasePrice: 700 },
    { ticker: "NFLX", company: "Netflix", shares: 7, purchasePrice: 500 },
    { ticker: "NVDA", company: "NVIDIA", shares: 10, purchasePrice: 220 },
    { ticker: "META", company: "Meta", shares: 9, purchasePrice: 330 },
    { ticker: "BABA", company: "Alibaba", shares: 14, purchasePrice: 180 },
    { ticker: "INTC", company: "Intel", shares: 20, purchasePrice: 60 },
    { ticker: "AMD", company: "AMD", shares: 16, purchasePrice: 90 },
    { ticker: "ORCL", company: "Oracle", shares: 13, purchasePrice: 85 },
    { ticker: "CSCO", company: "Cisco", shares: 18, purchasePrice: 55 },
    { ticker: "ADBE", company: "Adobe", shares: 6, purchasePrice: 480 },
    { ticker: "CRM", company: "Salesforce", shares: 11, purchasePrice: 210 },
    { ticker: "SHOP", company: "Shopify", shares: 7, purchasePrice: 1450 },
    { ticker: "UBER", company: "Uber", shares: 25, purchasePrice: 45 },
    { ticker: "LYFT", company: "Lyft", shares: 30, purchasePrice: 50 },
    { ticker: "SQ", company: "Block", shares: 10, purchasePrice: 240 },
  ]);

  // pagination and sorting logic
  const [currentPrices, setCurrentPrices] = useState({});
  const [totalGainLoss, setTotalGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAscending, setSortAscending] = useState(true);
  const stocksPerPage = 5;
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const sortedStocks = myStocks
    .map((stock) => {
      const currentPrice =
        parseFloat(currentPrices[stock.ticker]) || stock.purchasePrice;
      const gainLossPercentage =
        ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;

      return { ...stock, currentPrice, gainLossPercentage };
    })
    .sort((a, b) =>
      sortAscending
        ? b.gainLossPercentage - a.gainLossPercentage
        : a.gainLossPercentage - b.gainLossPercentage
    );
  const currentStocks = sortedStocks.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(myStocks.length / stocksPerPage);

  // Effect to update current prices based on the stocks prop
  // This effect runs whenever the stocks prop changes
  useEffect(() => {
    const pricesMap = stocks.reduce((acc, stock) => {
      acc[stock.Ticker] = stock.CurrentPrice || 0; // Use 0 if CurrentPrice is undefined
      return acc;
    }, {});
    setCurrentPrices(pricesMap);
    console.log(pricesMap);
  }, [stocks]);

  // Effect to calculate total gain/loss and current value
  // This effect runs whenever myStocks or currentPrices change
  useEffect(() => {
    if (myStocks.length > 0) {
      let totalPurchaseValue = 0;
      let totalCurrentValue = 0;

      myStocks.forEach((stock) => {
        const currentPrice =
          parseFloat(currentPrices[stock.ticker]) || stock.purchasePrice;
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
        <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          My Stocks
        </h2>
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
      <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700">
        <thead>
          <tr className="bg-zinc-200 dark:bg-zinc-700">
            <th className="px-4 py-2"> Ticker</th>
            <th className="px-4 py-2"> Company</th>
            <th className="px-4 py-2"> Shares</th>
            <th className="px-4 py-2"> Current Price</th>
            <th
              onClick={() => setSortAscending(!sortAscending)}
              className="px-4 py-2"
            >
              {sortAscending ? "↓" : "↑"} Gain/Loss (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentStocks.map((stock) => (
            <tr
              key={stock.ticker}
              className="hover:bg-blue-50 dark:hover:bg-zinc-600 dark:text-zinc-100 text-center"
            >
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                {stock.ticker}
              </td>
              <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                {stock.company}
              </td>
              <td className="px-4 py-2  border border-zinc-300 dark:border-zinc-700">
                {stock.shares}
              </td>
              <td className="px-4 py-2  border border-zinc-300 dark:border-zinc-700">
                ${stock.currentPrice.toFixed(2)}
              </td>
              <td
                className={`px-4 py-2  font-bold border border-zinc-300 dark:border-zinc-700 ${
                  stock.gainLossPercentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stock.gainLossPercentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      {/* Only show pagination if there are more stocks than can fit on one page */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-zinc-200 text-black hover:bg-blue-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyStocks;
