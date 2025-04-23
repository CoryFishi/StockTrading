import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockInfoModal = ({
  isStockInfoModalOpen,
  setIsStockInfoModalOpen,
  selectedStock,
}) => {
  const [shares, setShares] = useState(1);
  const [message, setMessage] = useState("");

  if (!isStockInfoModalOpen || !selectedStock) return null;

  const {
    CompanyName,
    Ticker,
    CurrentPrice,
    Volume,
    dayHigh,
    dayLow,
    dayStart,
    history = [],
  } = selectedStock;

  const handleBuy = () => {
    setMessage(`Bought ${shares} share(s) of ${Ticker}`);
  };

  const handleSell = () => {
    setMessage(`Sold ${shares} share(s) of ${Ticker}`);
  };

  const handleClose = () => {
    setIsStockInfoModalOpen(false);
    setShares(1);
    setMessage("");
  };

  const gainLoss = (
    parseFloat(CurrentPrice) - parseFloat(dayStart || CurrentPrice)
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {CompanyName} ({Ticker})
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            ${parseFloat(CurrentPrice).toFixed(2)} • Volume:{" "}
            {Volume.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-black dark:text-white">
          <div>Day Start: ${dayStart || "N/A"}</div>
          <div>Day High: ${dayHigh}</div>
          <div>Day Low: ${dayLow}</div>
          <div>
            Gain/Loss:{" "}
            <span className={gainLoss >= 0 ? "text-green-500" : "text-red-500"}>
              {gainLoss >= 0 ? "+" : ""}
              {gainLoss}
            </span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history.map((h) => ({
                  ...h,
                  price: parseFloat(h.price),
                }))}
              >
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            className="w-24 p-1 rounded border text-black"
          />
          <button
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            onClick={handleBuy}
          >
            Buy
          </button>
          <button
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={handleSell}
          >
            Sell
          </button>
        </div>

        {message && (
          <p className="text-center text-sm mt-2 text-blue-500">{message}</p>
        )}

        <button
          onClick={handleClose}
          className="w-full mt-4 bg-zinc-300 dark:bg-zinc-700 py-2 rounded hover:bg-zinc-400 dark:hover:bg-zinc-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StockInfoModal;
