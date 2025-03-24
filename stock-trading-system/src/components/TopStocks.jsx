import React, { useState, useEffect } from "react";

const TopStocks = ({ stocks, loading }) => {
  const [topStocks, setTopStocks] = useState([]);

  useEffect(() => {
    if (stocks.length > 0) {
      // Calculate percentage change based on dayStart
      const stocksWithPerformance = stocks.map((stock) => {
        const price = parseFloat(stock.CurrentPrice || stock.price);
        const dayStart = parseFloat(stock.InitialPrice || stock.dayStart);
        const percentageChange = ((price - dayStart) / dayStart) * 100;

        return {
          ...stock,
          percentageChange,
          ticker: stock.Ticker,
          company: stock.CompanyName,
          price,
        };
      });

      // Sort stocks by percentage change in descending order
      const sortedStocks = stocksWithPerformance.sort(
        (a, b) => b.percentageChange - a.percentageChange
      );

      setTopStocks(sortedStocks.slice(0, 5)); // Get top 5 stocks
    }
  }, [stocks]);

  return (
    <div className="w-full mx-auto p-1 bg-white dark:bg-zinc-800 dark:text-white">
      <h2 className="text-xl font-bold text-center text-zinc-800 dark:text-white mb-4">
        Top 5 Performing Stocks
      </h2>
      {topStocks.length === 0 ? (
        <p className="text-center text-zinc-600 dark:text-white">
          Loading top stocks...
        </p>
      ) : topStocks.length === 0 ? (
        <p className="text-center text-zinc-600 dark:text-white">
          No stocks available.
        </p>
      ) : (
        <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700">
          <thead>
            <tr className="bg-zinc-200 dark:bg-zinc-700">
              <th className="px-4 py-2"> Ticker</th>
              <th className="px-4 py-2"> Company</th>
              <th className="px-4 py-2"> % Change</th>
              <th className="px-4 py-2"> Price</th>
            </tr>
          </thead>
          <tbody>
            {topStocks.map((stock) => (
              <tr
                key={stock.id}
                className="hover:bg-blue-50 dark:hover:bg-zinc-600 dark:text-zinc-100 text-center"
              >
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                  {stock.ticker}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                  {stock.company}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                  {stock.percentageChange.toFixed(2)}%
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                  ${stock.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopStocks;
