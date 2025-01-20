import React, { useState, useEffect } from "react";

const UnderStocks = ({ stocks, loading }) => {
  const [bottomStocks, setBottomStocks] = useState([]);

  useEffect(() => {
    if (stocks.length > 0) {
      // Calculate percentage change based on dayStart
      const stocksWithPerformance = stocks.map((stock) => {
        const percentageChange =
          ((stock.price - stock.dayStart) / stock.dayStart) * 100;
        return { ...stock, percentageChange };
      });

      // Sort stocks by percentage change in ascending order
      const sortedStocks = stocksWithPerformance.sort(
        (a, b) => a.percentageChange - b.percentageChange
      );

      // Get the bottom 5 stocks
      setBottomStocks(sortedStocks.slice(0, 5));
    }
  }, [stocks]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg py-1">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Bottom 5 Performing Stocks
      </h2>
      {bottomStocks.length === 0 ? (
        <p className="text-center text-gray-600">Loading stocks...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left border border-gray-300">
                Ticker
              </th>
              <th className="px-4 py-2 text-left border border-gray-300">
                Company
              </th>
              <th className="px-4 py-2 text-right border border-gray-300">
                % Change
              </th>
              <th className="px-4 py-2 text-right border border-gray-300">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {bottomStocks.map((stock) => (
              <tr key={stock.ticker} className="hover:bg-blue-50">
                <td className="px-4 py-2 border border-gray-300">
                  {stock.ticker}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.company}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-right">
                  {stock.percentageChange.toFixed(2)}%
                </td>
                <td className="px-4 py-2 border border-gray-300 text-right">
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

export default UnderStocks;
