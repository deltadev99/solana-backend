const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const crypto = require("crypto");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// random sol address generator
function randomAddress() {
  return crypto.randomBytes(32).toString("hex");
}

// REAL SCAN
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const j = await r.json();

    if (!j.pairs?.length) return res.json({ status: "NOT FOUND" });

    const p = j.pairs[0];

    res.json({
      token: address,
      name: p.baseToken.name,
      symbol: p.baseToken.symbol,
      liquidity: Math.floor(p.liquidity.usd || 0),
      fdv: Math.floor(p.fdv || 0),
      dex: p.dexId,
      risk: p.liquidity.usd < 20000 ? 80 : 10,
      status: p.liquidity.usd < 20000 ? "RISKY" : "SAFE"
    });

  } catch {
    res.json({ status: "ERROR" });
  }
});

// ALWAYS RETURN DATA
app.get("/new", (req, res) => {
  res.json([
    {
      token: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      liquidity: 100000
    },
    {
      token: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      symbol: "BTC",
      liquidity: 50000
    },
    {
      token: "Es9vMFrzaCERg9L9nZ6G5D7mK6hJpN96CB2TF8iqZ7hG",
      symbol: "USDT",
      liquidity: 90000
    }
  ]);
});

app.listen(PORT, () => console.log("Server running", PORT));
