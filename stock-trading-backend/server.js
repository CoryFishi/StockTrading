require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Dummy stocks data
const stocks = [
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    price: 150,
    volume: 1000,
    dayHigh: 150,
    dayLow: 150,
    history: [],
    dayStart: 150,
    dayEnd: null,
  },
  {
    ticker: "GOOGL",
    company: "Google Inc.",
    price: 2800,
    volume: 500,
    dayHigh: 2800,
    dayLow: 2800,
    history: [],
    dayStart: 2800,
    dayEnd: null,
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    price: 900,
    volume: 300,
    dayHigh: 900,
    dayLow: 900,
    history: [],
    dayStart: 900,
    dayEnd: null,
  },
  {
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    price: 3400,
    volume: 700,
    dayHigh: 3400,
    dayLow: 3400,
    history: [],
    dayStart: 3400,
    dayEnd: null,
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    price: 310,
    volume: 1200,
    dayHigh: 310,
    dayLow: 310,
    history: [],
    dayStart: 310,
    dayEnd: null,
  },
  {
    ticker: "NFLX",
    company: "Netflix Inc.",
    price: 680,
    volume: 400,
    dayHigh: 680,
    dayLow: 680,
    history: [],
    dayStart: 680,
    dayEnd: null,
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    price: 230,
    volume: 800,
    dayHigh: 230,
    dayLow: 230,
    history: [],
    dayStart: 230,
    dayEnd: null,
  },
  {
    ticker: "FB",
    company: "Meta Platforms Inc.",
    price: 330,
    volume: 600,
    dayHigh: 330,
    dayLow: 330,
    history: [],
    dayStart: 330,
    dayEnd: null,
  },
  {
    ticker: "DIS",
    company: "The Walt Disney Co.",
    price: 150,
    volume: 500,
    dayHigh: 150,
    dayLow: 150,
    history: [],
    dayStart: 150,
    dayEnd: null,
  },
  {
    ticker: "PYPL",
    company: "PayPal Holdings Inc.",
    price: 200,
    volume: 450,
    dayHigh: 200,
    dayLow: 200,
    history: [],
    dayStart: 200,
    dayEnd: null,
  },
  {
    ticker: "ORCL",
    company: "Oracle Corp.",
    price: 95,
    volume: 900,
    dayHigh: 95,
    dayLow: 95,
    history: [],
    dayStart: 95,
    dayEnd: null,
  },
  {
    ticker: "ADBE",
    company: "Adobe Inc.",
    price: 600,
    volume: 300,
    dayHigh: 600,
    dayLow: 600,
    history: [],
    dayStart: 600,
    dayEnd: null,
  },
];

// Function to simulate stock price updates
function updateStockPrices() {
  stocks.forEach((stock) => {
    const currentPrice = parseFloat(stock.price);
    const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
    const newPrice = Math.max(currentPrice + change, 0); // Ensure non-negative price

    // Update stock details
    stock.price = newPrice.toFixed(2);
    stock.dayHigh = Math.max(stock.dayHigh, newPrice);
    stock.dayLow = Math.min(stock.dayLow, newPrice);

    // Update dayEnd to reflect the latest price
    stock.dayEnd = newPrice;

    // Add the new price to the history array
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    stock.history.push({ time, price: newPrice });

    // Keep only the last 20 data points to limit memory usage
    if (stock.history.length > 20) {
      stock.history.shift();
    }
  });

  // Emit updated stocks
  io.emit("stockUpdate", stocks);
}

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Send initial stock data to the connected client
  socket.emit("stockUpdate", stocks);

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Update stock prices every second
setInterval(updateStockPrices, 5000);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
