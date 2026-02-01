const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

// REAL SCAN
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    // DexScreener
    const dex = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`
    );
    const dexData = await dex.json();

    if (!dexData.pairs || dexData.pairs.length === 0) {
      return res.json({ error: "Token not found" });
    }

    const pair = dexData.pairs[0];

    const liquidity = pair.liquidity?.usd || 0;
    const holders = pair.txns?.h24?.buys + pair.txns?.h24?.sells || 0;

    // simple risk algo
    let risk = 0;
    if (liquidity < 5000) risk += 40;
    if (pair.fdv < 100000) risk += 30;
    if (pair.priceChange?.h1 < -20) risk += 30;

    res.json({
      token: address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      liquidity: Math.floor(liquidity),
      fdv: Math.floor(pair.fdv),
      priceUsd: pair.priceUsd,
      volume24h: pair.volume.h24,
      dex: pair.dexId,
      risk,
      status: risk > 60 ? "HIGH RISK" : "SAFE"
    });
  } catch (err) {
    res.json({ error: "scan failed" });
  }
});

// Railway port
app.listen(3001, () => {
  console.log("Server running on 3001");
});
