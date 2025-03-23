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
    <div className="w-full mx-auto p-1 bg-white">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Real-Time Stock Prices
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading stock data...</p>
      ) : bottomStocks.length === 0 ? (
        <p className="text-center text-gray-600">No stock data available.</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left border border-gray-300">
                  Ticker
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Price
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Volume
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Market Cap
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Day High
                </th>
                <th className="px-4 py-2 text-left border border-gray-300">
                  Day Low
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock, index) => (
                <tr
                  key={stock.id}
                  onClick={() => setSelectedStock(stock)}
                  className={`cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-100`}
                >
                  <td className="px-4 py-2 border border-gray-300">
                    {stock.ticker}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${Number(stock.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {stock.volume}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${(Number(stock.price) * Number(stock.volume)).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${Number(stock.dayHigh || stock.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${Number(stock.dayLow || stock.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
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

          {selectedStock && (
            <div className="mt-8">
              <h2
                className="text-xl font-bold text-center"
                onClick={() => console.log(selectedStock.history)}
              >
                {selectedStock.ticker} Price Trend
              </h2>
              <StockGraph
                stockHistory={selectedStock.history}
                ticker={selectedStock.ticker}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockTicker;
