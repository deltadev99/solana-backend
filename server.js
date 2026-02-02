const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ===============================
// NEW PAIRS (REAL SOLANA)
// ===============================
app.get("/newpairs", async (req, res) => {
  try {
    const url =
      "https://api.dexscreener.com/latest/dex/pairs/solana";

    const r = await fetch(url);
    const data = await r.json();

    if (!data.pairs) return res.json([]);

    const pairs = data.pairs
      .filter(p => p.liquidity?.usd > 5000)
      .slice(0, 15)
      .map(p => ({
        token: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        liquidity: Math.round(p.liquidity.usd),
        fdv: Math.round(p.fdv || 0),
        dex: p.dexId,
        created: p.pairCreatedAt
      }));

    res.json(pairs);
  } catch (e) {
    console.error(e);
    res.json([]);
  }
});

// ===============================
// TOKEN SCAN
// ===============================
app.get("/scan/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const url = `https://api.dexscreener.com/latest/dex/tokens/${token}`;

    const r = await fetch(url);
    const d = await r.json();

    if (!d.pairs || !d.pairs.length)
      return res.json({ status: "NOT FOUND" });

    const p = d.pairs[0];

    res.json({
      token,
      name: p.baseToken.name,
      symbol: p.baseToken.symbol,
      liquidity: Math.round(p.liquidity.usd),
      fdv: Math.round(p.fdv || 0),
      priceUsd: p.priceUsd,
      volume24h: p.volume.h24,
      dex: p.dexId,
      risk: p.liquidity.usd < 20000 ? 50 : 10,
      status: p.liquidity.usd > 20000 ? "SAFE" : "RISKY"
    });
  } catch (e) {
    console.error(e);
    res.json({ status: "ERROR" });
  }
});

app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
