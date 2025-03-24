import React, { useState } from "react";
import StockGraph from "./StockGraph";

const StockTicker = ({ stocks, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);

  const stocksPerPage = 5;

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  const totalPages = Math.ceil(stocks.length / stocksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full mx-auto p-1 bg-white dark:bg-zinc-800 dark:text-white">
      <h1 className="text-2xl font-bold text-center mb-4">
        Real-Time Stock Prices
      </h1>

      {loading ? (
        <p className="text-center text-zinc-600 dark:text-white">
          Loading stock data...
        </p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700">
            <thead>
              <tr className="bg-zinc-200 dark:bg-zinc-700">
                <th className="px-4 py-2">Ticker</th>
                <th className="px-4 py-2"> Company</th>
                <th className="px-4 py-2"> Price</th>
                <th className="px-4 py-2"> Volume</th>
                <th className="px-4 py-2"> Market Cap</th>
                <th className="px-4 py-2"> Day High</th>
                <th className="px-4 py-2"> Day Low</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock, index) => {
                const ticker = stock.Ticker || stock.ticker || "N/A";
                const company = stock.CompanyName || stock.company || "Unknown";
                const price = parseFloat(stock.CurrentPrice || 0);
                const volume = parseFloat(stock.Volume || stock.volume || 0);
                const dayHigh = parseFloat(stock.dayHigh ?? price);
                const dayLow = parseFloat(stock.dayLow ?? price);
                const marketCap = price * volume;

                return (
                  <tr
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className={
                      "hover:bg-blue-50 dark:hover:bg-zinc-600 dark:text-zinc-100 text-center"
                    }
                  >
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      {ticker}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      {company}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      ${price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      {volume}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      ${marketCap.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      ${dayHigh.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-700">
                      ${dayLow.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
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

          {selectedStock && (
            <div className="mt-8">
              {(() => {
                const selectedTicker =
                  selectedStock.Ticker || selectedStock.ticker || "Stock";
                return (
                  <>
                    <h2 className="text-xl font-bold text-center">
                      {selectedTicker} Price Trend
                    </h2>
                    <StockGraph
                      stockHistory={selectedStock.history}
                      ticker={selectedTicker}
                    />
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockTicker;
