import React, { useState } from "react";
import axios from "axios";

const AddStockForm = () => {
  const [formData, setFormData] = useState({
    ticker: "",
    company: "",
    price: "",
    volume: "",
    dayHigh: "",
    dayLow: "",
    dayStart: "",
    dayEnd: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://23.22.184.219/api/addStock",
        formData
      );
      setMessage(response.data.message || "Stock added successfully!");
      setFormData({
        ticker: "",
        company: "",
        price: "",
        volume: "",
        dayHigh: "",
        dayLow: "",
        dayStart: "",
        dayEnd: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to add stock. Please try again."
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ticker"
          placeholder="Ticker (e.g., AAPL)"
          value={formData.ticker}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="volume"
          placeholder="Volume"
          value={formData.volume}
          onChange={handleChange}
          required
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="dayHigh"
          placeholder="Day High (optional)"
          value={formData.dayHigh}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="dayLow"
          placeholder="Day Low (optional)"
          value={formData.dayLow}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="dayStart"
          placeholder="Day Start (optional)"
          value={formData.dayStart}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="dayEnd"
          placeholder="Day End (optional)"
          value={formData.dayEnd}
          onChange={handleChange}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Stock
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-lg font-semibold text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default AddStockForm;
