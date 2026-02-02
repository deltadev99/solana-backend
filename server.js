const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Solana Backend Alive");
});

app.get("/scan/:address", async (req, res) => {
  try {
    const token = req.params.address;

    // dummy scanner (replace later with GMGN / Birdeye API)
    const result = {
      token,
      name: "ELEMENTARDIO",
      symbol: "AUTARDIO",
      liquidity: 61817,
      fdv: 500112,
      priceUsd: "0.0005001",
      volume24h: 907431,
      dex: "pumpswap",
      risk: 0,
      status: "SAFE"
    };

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "scan failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
