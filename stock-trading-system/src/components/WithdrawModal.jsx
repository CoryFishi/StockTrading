import React, { useState } from "react";

const WithdrawModal = ({ isWithdrawModalOpen, setIsWithdrawModalOpen }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();
    console.log("Withdrawn amount:", withdrawAmount);
    setIsWithdrawModalOpen(false);
  };

  const handleCancel = () => {
    setIsWithdrawModalOpen(false);
    setWithdrawAmount("");
    setMessage("");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-zinc-800 shadow-md rounded space-y-3">
        <h1 className="text-2xl font-bold text-center">Withdraw Funds</h1>
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter withdrawal amount"
          className="w-full px-4 py-2 border border-gray-300 rounded text-black"
        />
        <div className="flex space-x-2">
          <button
            className="w-full text-white dark:text-black bg-slate-400 py-2 px-4 rounded cursor-pointer hover:bg-slate-500 transition duration-200 ease-in-out"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="w-full text-white dark:text-black bg-[#6362E7] py-2 px-4 rounded cursor-pointer hover:bg-[#4747e9] transition duration-200 ease-in-out"
            onClick={handleWithdraw}
          >
            Deposit
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;
