const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROOT
app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

// SCAN WALLET
app.get("/scan/:address", async (req, res) => {
  const address = req.params.address;

  if (!address) {
    return res.status(400).json({ error: "No address provided" });
  }

  // sementara dummy dulu
  res.json({
    wallet: address,
    profit: Math.floor(Math.random() * 1000),
    trades: Math.floor(Math.random() * 50),
    status: "ok"
  });
});

// IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
