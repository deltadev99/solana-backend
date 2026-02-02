const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// SCAN TOKEN
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

// REAL SOLANA MEMES (pump.fun)
app.get("/new", async (req, res) => {
  try {
    const r = await fetch("https://frontend-api.pump.fun/coins");
    const j = await r.json();

    const list = j.slice(0, 20).map(c => ({
      token: c.mint,
      symbol: c.symbol || "NEW",
      liquidity: c.usd_market_cap || 0
    }));

    res.json(list);

  } catch (e) {
    res.json([]);
  }
});

app.listen(PORT, () => console.log("Server running", PORT));
