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
const bcrypt = require("bcrypt");
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
// Check if market should be open or closed
db.query("SELECT * FROM MarketSchedule LIMIT 1", (err, results) => {
  if (err) {
    console.error("Error fetching market schedule:", err);
    return;
  }

  if (results.length > 0) {
    const schedule = results[0];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMinute] = (schedule.MarketOpen || "09:00:00").split(":").map(Number);
    const [closeHour, closeMinute] = (schedule.MarketClose || "17:00:00").split(":").map(Number);

    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    let newStatus = (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) ? 1 : 0;

    if (newStatus !== schedule.MarketStatus) {
      db.query(
        "UPDATE MarketSchedule SET MarketStatus = ? WHERE MarketScheduleID = ?",
        [newStatus, schedule.MarketScheduleID],
        (updateErr) => {
          if (updateErr) {
            console.error("Failed to update MarketStatus:", updateErr);
          } else {
            console.log(`Market status updated to: ${newStatus === 1 ? "Open" : "Closed"}`);
          }
        }
      );
    }
  }
});

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
        'UPDATE stocks SET history = ? WHERE id = ?',
        [JSON.stringify(history), stock.id],
        (err) => {
          if (err)
            console.error('Error updating history for ${stock.Ticker}:', err);
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
  console.log("/api/data was hit");
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      res.status(500).send("Database query failed");
    } else {
      res.json(results);
    }
  });
});

// Endpoint to add a new stock
app.post("/api/addStock", (req, res) => {
  const { ticker, company, price, volume, dayHigh, dayLow, dayStart, dayEnd } =
    req.body;

  if (!ticker || !company || !price || !volume) {
    return res
      .status(400)
      .json({
        error: "Ticker, Company, CurrentPrice, and Volume are required",
      });
  }

  const query = `
  INSERT INTO stocks (Ticker, CompanyName, InitialPrice, CurrentPrice, Volume, dayHigh, dayLow, dayStart, dayEnd, history)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;


  db.query(
    query,
    [
      ticker,
      company,
      price, // InitialPrice
      price, // CurrentPrice (added this line)
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
        stock: results,
      });
    }
  );
});

// Register user
app.post("/api/register", async (req, res) => {
  const { FullName, Username, Password, Email, UserType } = req.body;

  if (!FullName || !Username || !Password || !Email || !UserType) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check for duplicates
    const checkQuery = "SELECT * FROM User WHERE Username = ? OR Email = ?";
    db.query(checkQuery, [Username, Email], async (err, results) => {
      if (err) {
        console.error("Error checking user existence:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length > 0) {
        return res
          .status(409)
          .json({ error: "Username or email already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Insert user
      const insertQuery = `
      INSERT INTO User (FullName, Username, Password, Email, UserType, CashBalance)
      VALUES (?, ?, ?, ?, ?, 10000.00)
    `;
    
      db.query(
        insertQuery,
        [FullName, Username, hashedPassword, Email, UserType],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error" });
          }

          return res
            .status(201)
            .json({ message: "User registered successfully!" });
        }
      );
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// Login user
app.post("/api/login", (req, res) => {
  const { UsernameOrEmail, Password } = req.body;

  if (!UsernameOrEmail || !Password) {
    return res
      .status(400)
      .json({ error: "Username/email and password are required." });
  }

  const query = `
  SELECT * FROM User
  WHERE Username = ? OR Email = ?
`;

  db.query(query, [UsernameOrEmail, UsernameOrEmail], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const user = results[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Return user info (exclude password in response)
    const { userID, FullName, Username, Email, UserType, CashBalance } = user;
    res.json({
      message: "Login successful",
      user: { userID, FullName, Username, Email, UserType, CashBalance },
    });
  });
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
app.delete("/api/deleteStock/:id", (req, res) => {
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

// Existing delete stock endpoint
app.delete("/api/deleteStock/:id", (req, res) => {
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

    res.status(200).json({ message: `Stock with id ${id} deleted successfully` });
  });
});

// Edit stock endpoint
app.put("/api/stock/:id", (req, res) => {
  const { id } = req.params;
  const {
    ticker,
    company,
    price,
    volume,
    dayHigh,
    dayLow,
    dayStart,
    dayEnd,
  } = req.body;

  const query = `
  UPDATE stocks
  SET 
    Ticker = ?, 
    CompanyName = ?, 
    CurrentPrice = ?, 
    Volume = ?, 
    dayHigh = ?, 
    dayLow = ?, 
    dayStart = ?, 
    dayEnd = ?
  WHERE id = ?
`;

  db.query(
    query,
    [ticker, company, price, volume, dayHigh, dayLow, dayStart, dayEnd, id],
    (err, results) => {
      if (err) {
        console.error("Error updating stock:", err);
        return res.status(500).json({ error: "Database update failed." });
      }

      res.status(200).json({ message: "Stock updated successfully." });
    }
  );
});




// Get portfolio for a user
app.get("/api/portfolio/:userID", (req, res) => {
  const userID = req.params.userID;

  const query = `
  SELECT 
    p.PortfolioID,
    p.StockID,
    s.Ticker,
    s.CompanyName,
    p.Quantity,
    p.AveragePrice
  FROM Portfolio p
  JOIN stocks s ON p.StockID = s.id
  WHERE p.UserID = ?
`;


  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error("Error fetching portfolio:", err);
      return res.status(500).json({ error: "Failed to fetch portfolio" });
    }

    res.json(results);
  });
});

app.get("/api", (req, res) => {
  res.send("Welcome to the Stock Trading API!");
});

// New API Endpoint
app.get("/api/your-endpoint", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
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

//Frontend
app.use(express.static(path.join(__dirname, "client")));


// GET the current market schedule
app.get("/api/market-schedule", (req, res) => {
  db.query("SELECT * FROM MarketSchedule LIMIT 1", (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch market schedule" });
    if (results.length === 0) return res.status(404).json({ error: "No market schedule found" });

    const row = results[0];
    res.json({
      MarketOpen: row.MarketOpen?.slice(0, 5) || "",
      MarketClose: row.MarketClose?.slice(0, 5) || "",
      OpenDays: row.OpenDays || "",
      Holidays: row.Holidays || "",
      MarketStatus: row.MarketStatus ?? 0,
    });
  });
});


// PUT update market schedule
app.put("/api/market-schedule/:id", (req, res) => {
  const { id } = req.params;
  const { openTime, closeTime, openWeekdays, holidays, status } = req.body;

  const updateQuery = `
  UPDATE MarketSchedule
  SET MarketOpen = ?, MarketClose = ?, OpenDays = ?, Holidays = ?, MarketStatus = ?
  WHERE MarketScheduleID = ?
`;


  db.query(
    updateQuery,
    [
      openTime,
      closeTime,
      openWeekdays.join(","),
      (holidays || []).join(","),
      status ? 1 : 0,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating market schedule:", err);
        return res.status(500).json({ error: "Failed to update schedule" });
      }

      res.json({ message: "Market schedule updated successfully" });
    }
  );
});

// post to deposit cash
app.post("/api/deposit", (req, res) => {
  const { userID, amount } = req.body;
  const amt = parseFloat(amount);

  if (!userID || isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: "userID and positive amount required" });
  }

  const upsert = `
    INSERT INTO CashAccounts (UserID, Balance)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE Balance = Balance + VALUES(Balance)
  `;

  db.query(upsert, [userID, amt], (err) => {
    if (err) {
      console.error("Deposit failed:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(
      "SELECT Balance FROM CashAccounts WHERE UserID = ?",
      [userID],
      (err2, rows) => {
        if (err2 || rows.length === 0) {
          return res.status(500).json({ error: "Could not read balance" });
        }

        res.json({ message: "Deposit successful", balance: rows[0].Balance });
      }
    );
  });
});

// post to withdraw cash
app.post("/api/withdraw", (req, res) => {
  const { userID, amount } = req.body;
  const amt = parseFloat(amount);
  if (!userID || isNaN(amt) || amt <= 0) {
    return res
      .status(400)
      .json({ error: "userID and positive amount required" });
  }
  const deduct = `
  UPDATE CashAccounts
  SET Balance = Balance - ?
  WHERE UserID = ? AND Balance >= ?
`;

  db.query(deduct, [amt, userID, amt], (err, result) => {
    if (err) {
      console.error("Withdrawal failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Insufficient funds" });
    }
    db.query(
      "SELECT Balance FROM CashAccounts WHERE UserID = ?",
      [userID],
      (err2, rows) => {
        if (err2 || rows.length === 0) {
                    return res.status(500).json({ error: "Could not read balance" });
        }
        res.json({
          message: "Withdrawal successful",
          balance: rows[0].Balance,
        });
      }
    );
  });
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});