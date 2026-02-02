const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// ================= SCAN TOKEN =================

app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const j = await r.json();

    if (!j.pairs || !j.pairs.length) {
      return res.json({ error: "Token not found" });
    }

    const p = j.pairs[0];

    res.json({
      token: address,
      name: p.baseToken.name,
      symbol: p.baseToken.symbol,
      liquidity: Math.floor(p.liquidity.usd || 0),
      fdv: Math.floor(p.fdv || 0),
      dex: p.dexId,
      risk: 0,
      status: p.liquidity.usd > 20000 ? "SAFE" : "RISK"
    });

  } catch {
    res.json({ error: "Scan failed" });
  }
});

// ================= NEW PAIRS =================

app.get("/new", async (req, res) => {
  try {
    const r = await fetch("https://api.dexscreener.com/latest/dex/search/?q=solana");
    const j = await r.json();

    const list = j.pairs
      .filter(p => p.chainId === "solana")
      .slice(0, 15)
      .map(p => ({
        token: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        liquidity: Math.floor(p.liquidity.usd || 0),
        dex: p.dexId
      }));

    res.json(list);
  } catch {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log("Listening on", PORT);
});
