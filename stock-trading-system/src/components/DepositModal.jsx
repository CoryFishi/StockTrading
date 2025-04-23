import React, { useState } from "react";

const DepositModal = ({ isDepositModalOpen, setIsDepositModalOpen }) => {
  const [despositAmount, setDepositAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    console.log("Deposited amount:", despositAmount);
    setIsDepositModalOpen(false);
  };

  const handleCancel = () => {
    setIsDepositModalOpen(false);
    setDepositAmount("");
    setMessage("");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-zinc-800 shadow-md rounded space-y-3">
        <h1 className="text-2xl font-bold text-center">Deposit Funds</h1>
        <input
          type="text"
          value={despositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter deposit amount"
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
            className="w-full bg-[#6362E7] text-white dark:text-black py-2 px-4 rounded cursor-pointer hover:bg-[#4747e9] transition duration-200 ease-in-out"
            onClick={handleDeposit}
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

export default DepositModal;
