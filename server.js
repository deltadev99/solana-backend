const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// ===== SCAN TOKEN =====
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const r = await fetch(url);
    const j = await r.json();

    if (!j.pairs || !j.pairs.length)
      return res.json({ status: "NOT FOUND" });

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

  } catch (e) {
    res.json({ error: "scan failed" });
  }
});

// ===== NEW PAIRS =====
app.get("/new", async (req, res) => {
  try {
    const url = "https://api.dexscreener.com/latest/dex/pairs/solana";
    const r = await fetch(url);
    const j = await r.json();

    const list = j.pairs.slice(0, 20).map(p => ({
      token: p.baseToken.address,
      symbol: p.baseToken.symbol,
      liquidity: Math.floor(p.liquidity.usd || 0)
    }));

    res.json(list);

  } catch {
    res.json([]);
  }
});

app.listen(PORT, () => console.log("Server running on", PORT));
