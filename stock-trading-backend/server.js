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
  },
  {
    ticker: "GOOGL",
    company: "Google Inc.",
    price: 2800,
    volume: 500,
    dayHigh: 2800,
    dayLow: 2800,
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    price: 900,
    volume: 300,
    dayHigh: 900,
    dayLow: 900,
  },
  {
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    price: 3400,
    volume: 700,
    dayHigh: 3400,
    dayLow: 3400,
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    price: 310,
    volume: 1200,
    dayHigh: 310,
    dayLow: 310,
  },
  {
    ticker: "NFLX",
    company: "Netflix Inc.",
    price: 680,
    volume: 400,
    dayHigh: 680,
    dayLow: 680,
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    price: 230,
    volume: 800,
    dayHigh: 230,
    dayLow: 230,
  },
  {
    ticker: "FB",
    company: "Meta Platforms Inc.",
    price: 330,
    volume: 600,
    dayHigh: 330,
    dayLow: 330,
  },
  {
    ticker: "DIS",
    company: "The Walt Disney Co.",
    price: 150,
    volume: 500,
    dayHigh: 150,
    dayLow: 150,
  },
  {
    ticker: "PYPL",
    company: "PayPal Holdings Inc.",
    price: 200,
    volume: 450,
    dayHigh: 200,
    dayLow: 200,
  },
  {
    ticker: "ORCL",
    company: "Oracle Corp.",
    price: 95,
    volume: 900,
    dayHigh: 95,
    dayLow: 95,
  },
  {
    ticker: "ADBE",
    company: "Adobe Inc.",
    price: 600,
    volume: 300,
    dayHigh: 600,
    dayLow: 600,
  },
  {
    ticker: "INTC",
    company: "Intel Corp.",
    price: 55,
    volume: 1100,
    dayHigh: 55,
    dayLow: 55,
  },
  {
    ticker: "CSCO",
    company: "Cisco Systems Inc.",
    price: 60,
    volume: 950,
    dayHigh: 60,
    dayLow: 60,
  },
  {
    ticker: "AMD",
    company: "Advanced Micro Devices Inc.",
    price: 125,
    volume: 850,
    dayHigh: 125,
    dayLow: 125,
  },
  {
    ticker: "CRM",
    company: "Salesforce.com Inc.",
    price: 250,
    volume: 400,
    dayHigh: 250,
    dayLow: 250,
  },
  {
    ticker: "SQ",
    company: "Block Inc.",
    price: 220,
    volume: 500,
    dayHigh: 220,
    dayLow: 220,
  },
  {
    ticker: "TWTR",
    company: "Twitter Inc.",
    price: 45,
    volume: 1000,
    dayHigh: 45,
    dayLow: 45,
  },
  {
    ticker: "UBER",
    company: "Uber Technologies Inc.",
    price: 50,
    volume: 1300,
    dayHigh: 50,
    dayLow: 50,
  },
  {
    ticker: "LYFT",
    company: "Lyft Inc.",
    price: 60,
    volume: 700,
    dayHigh: 60,
    dayLow: 60,
  },
  {
    ticker: "SHOP",
    company: "Shopify Inc.",
    price: 1450,
    volume: 200,
    dayHigh: 1450,
    dayLow: 1450,
  },
  {
    ticker: "SPOT",
    company: "Spotify Technology SA",
    price: 300,
    volume: 400,
    dayHigh: 300,
    dayLow: 300,
  },
  {
    ticker: "BA",
    company: "The Boeing Co.",
    price: 240,
    volume: 350,
    dayHigh: 240,
    dayLow: 240,
  },
  {
    ticker: "SNAP",
    company: "Snap Inc.",
    price: 65,
    volume: 1000,
    dayHigh: 65,
    dayLow: 65,
  },
  {
    ticker: "COST",
    company: "Costco Wholesale Corp.",
    price: 510,
    volume: 400,
    dayHigh: 510,
    dayLow: 510,
  },
];

// Function to simulate stock price updates
function updateStockPrices() {
  stocks.forEach((stock) => {
    const currentPrice = parseFloat(stock.price);
    const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
    const newPrice = Math.max(currentPrice + change, 0); // Ensure non-negative price

    // Update day high and day low
    stock.dayHigh = stock.dayHigh
      ? Math.max(stock.dayHigh, newPrice)
      : newPrice;
    stock.dayLow = stock.dayLow ? Math.min(stock.dayLow, newPrice) : newPrice;

    // Update the current price
    stock.price = newPrice.toFixed(2);
  });

  // Emit updated stock data
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
