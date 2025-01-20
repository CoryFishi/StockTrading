import React, { useEffect, useState } from "react";
import socket from "../socket";

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 10; // Number of stocks per page

  useEffect(() => {
    // Listen for stock updates
    socket.on("stockUpdate", (data) => {
      setStocks(data);
      setLoading(false); // Data received, stop loading
    });

    // Cleanup on unmount
    return () => {
      socket.off("stockUpdate");
    };
  }, []);

  // Pagination calculations
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  const totalPages = Math.ceil(stocks.length / stocksPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-white overflow-y-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Real-Time Stock Prices
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading stock data...</p>
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
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2 border border-gray-300">
                    {stock.ticker}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${stock.price}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {stock.volume}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${(stock.price * stock.volume).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${stock.dayHigh.toFixed(2) || stock.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    ${stock.dayLow.toFixed(2) || stock.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default StockTicker;
