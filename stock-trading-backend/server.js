require("dotenv").config();
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://3.90.131.54", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3();
const BUCKET_NAME = "stock-trading-uploads";

// Helper Function to sanatize for MYSQL db
function sanitizeNumber(value, fallback = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? fallback : num;
}


// Function to simulate and price updates
function updateStockPrices() {
  console.log("Updating stock prices...");

  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      console.error("Error fetching stocks:", err);
      return;
    }

    results.forEach((stock) => {
      const currentPrice = parseFloat(stock.CurrentPrice);
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      let history = [];
      try {
        history = JSON.parse(stock.history) || [];
        if (!Array.isArray(history)) history = [];
      } catch {
        history = [];
      }

      // Append the current price to the history
      history.push({ time, price: currentPrice.toFixed(2) });
      if (history.length > 20) history.shift(); // Trim to last 20

      // Update only the history field
      db.query(
        `UPDATE stocks SET history = ? WHERE id = ?`,
        [JSON.stringify(history), stock.id],
        (err) => {
          if (err) console.error(`Error updating history for ${stock.Ticker}:`, err);
        }
      );
    });

    // Emit updated stock data
    db.query("SELECT * FROM stocks", (err, updatedStocks) => {
      if (err) {
        console.error("Error fetching updated stocks:", err);
        return;
      }

      io.emit("stockUpdate", updatedStocks);
    });
  });
}


// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Send initial stock data to the connected client
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      console.error("Error fetching initial stocks:", err);
      return;
    }
    socket.emit("stockUpdate", results);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Update stock prices every 30 seconds
setInterval(updateStockPrices, 30000);

//
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      res.status(500).send("Database query failed");
    } else {
      res.json(results);
    }
  });
});

// Endpoint to add a new stock
app.post("/addStock", (req, res) => {
  const { ticker, company, price, volume, dayHigh, dayLow, dayStart, dayEnd } =
    req.body;

  if (!ticker || !company || !price || !volume) {
    return res
      .status(400)
      .json({ error: "Ticker, company, price, and volume are required" });
  }

  const query = `
      INSERT INTO stocks (ticker, company, price, volume, dayHigh, dayLow, dayStart, dayEnd, history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      ticker,
      company,
      price,
      volume,
      dayHigh || price,
      dayLow || price,
      dayStart || price,
      dayEnd || price,
      JSON.stringify([]), // Initialize history as an empty array
    ],
    (err, results) => {
      if (err) {
        console.error("Error adding stock:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.status(201).json({
        message: "Stock added successfully",
        stockId: results.insertId,
      });
    }
  );
});
/// Added S3 bucket functionality
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: req.file.originalname, //s3 name
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({ message: "Upload successful", url: data.Location });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

//
app.delete("/deleteStock/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM stocks WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting stock:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res
      .status(200)
      .json({ message: `Stock with id ${id} deleted successfully` });
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Stock Trading API!");
});

// New API Endpoint
app.get("/api/your-endpoint", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

//Frontend
app.use(express.static(path.join(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});


// Start HTTP server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start WebSocket server
const SOCKET_PORT = process.env.SOCKET_PORT || 4000;
server.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server running on port ${SOCKET_PORT}`);
});
