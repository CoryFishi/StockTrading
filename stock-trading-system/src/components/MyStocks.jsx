import React, { useState, useEffect } from "react";
import socket from "../socket";

const MyStocks = ({ stocks }) => {
  const [myStocks, setMyStocks] = useState([
    { ticker: "AAPL", company: "Apple", shares: 10, purchasePrice: 140 },
    { ticker: "BBL", company: "Jesus", shares: 10, purchasePrice: 120 },
  ]);

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

  useEffect(() => {
    const pricesMap = stocks.reduce((acc, stock) => {
      acc[stock.ticker] = stock.price;
      return acc;
    }, {});
    setCurrentPrices(pricesMap);
  }, [stocks]);

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

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg p-1">
      <div className="flex justify-between items-center mb-2">
        <h2 className="ml-5 text-2xl font-bold text-gray-800 dark:text-gray-100">
          My Stocks
        </h2>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${
              totalGainLoss.value > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {totalGainLoss.value > 0 ? "+" : ""}$
            {totalGainLoss.value.toFixed(2)} (
            {totalGainLoss.percentage.toFixed(2)}%)
          </p>
          <p className="text-lg text-gray-800 dark:text-gray-100">
            ${totalCurrentValue.toFixed(2)}
          </p>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              Ticker
            </th>
            <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              Company
            </th>
            <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              Shares
            </th>
            <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              Current Price
            </th>
            <th
              onClick={() => setSortAscending(!sortAscending)}
              className="hover:cursor-pointer px-4 py-2 text-right text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            >
              {sortAscending ? "↓" : "↑"} Gain/Loss (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentStocks.map((stock) => (
            <tr
              key={stock.ticker}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                {stock.ticker}
              </td>
              <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                {stock.company}
              </td>
              <td className="px-4 py-2 text-right border border-gray-300 dark:border-gray-700">
                {stock.shares}
              </td>
              <td className="px-4 py-2 text-right border border-gray-300 dark:border-gray-700">
                ${stock.currentPrice.toFixed(2)}
              </td>
              <td
                className={`px-4 py-2 text-right font-bold border border-gray-300 dark:border-gray-700 ${
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

      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-blue-100"
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
