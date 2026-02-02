const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// scoring
function scoreToken(liq, fdv) {
  let score = 50;
  if (liq > 50000) score += 20;
  if (liq > 100000) score += 10;
  if (fdv < 500000) score += 10;
  if (fdv > 5000000) score -= 20;
  return Math.max(0, Math.min(100, score));
}

// fake dev %
function devHold() {
  return (Math.random() * 5).toFixed(2);
}

// rug probability
function rugRisk(liq, dev) {
  let risk = 30;
  if (liq < 20000) risk += 30;
  if (dev > 3) risk += 20;
  return Math.min(100, risk);
}

// SCAN
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const j = await r.json();

    if (!j.pairs?.length) return res.json({ status: "NOT FOUND" });

    const p = j.pairs[0];

    const liquidity = Math.floor(p.liquidity.usd || 0);
    const fdv = Math.floor(p.fdv || 0);

    const score = scoreToken(liquidity, fdv);
    const dev = devHold();
    const rug = rugRisk(liquidity, dev);

    res.json({
      token: address,
      name: p.baseToken.name,
      symbol: p.baseToken.symbol,
      liquidity,
      fdv,
      dex: p.dexId,
      score,
      devHold: dev + "%",
      rugRisk: rug + "%",
      status: rug < 40 ? "🟢 SAFE" : rug < 70 ? "🟡 MEDIUM" : "🔴 HIGH"
    });

  } catch {
    res.json({ status: "ERROR" });
  }
});

// MOCK NEW
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
