const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// root test
app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

// scan token endpoint
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    // contoh dummy data dulu (nanti bisa upgrade API asli)
    const result = {
      token: address,
      liquidity: Math.floor(Math.random() * 50000),
      holders: Math.floor(Math.random() * 3000),
      dev: (Math.random() * 5).toFixed(2) + "%",
      mint: Math.random() > 0.5 ? "YES" : "NO",
      freeze: Math.random() > 0.5 ? "YES" : "NO",
      risk: Math.floor(Math.random() * 100),
      status: "SAFE"
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// IMPORTANT: Railway PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
