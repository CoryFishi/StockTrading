import React, { useState } from "react";

const DeleteStock = () => {
  const [stockId, setStockId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before starting the request

    if (!stockId) {
      setMessage("Please enter a valid stock ID.");
      return;
    }

    try {
      const response = await fetch(
        `http://23.22.184.219/api/deleteStock/${stockId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      const data = await response.json();
      setMessage(
        data.message || `Stock with ID ${stockId} deleted successfully.`
      );
      setStockId(""); // Clear the input field
    } catch (error) {
      console.error("Error deleting stock:", error);
      setMessage("Error: Unable to delete stock. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-center mb-4">Delete Stock</h1>
      <form onSubmit={handleDelete} className="space-y-4">
        <input
          type="text"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          placeholder="Enter Stock ID"
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete Stock
        </button>
      </form>
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
  );
};

export default DeleteStock;
