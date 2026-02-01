const express = require("express");
const cors = require("cors");

// dynamic fetch (Node 22 compatible)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

// ================= REAL TOKEN SCAN =================
app.get("/scan/:address", async (req, res) => {
  try {
    const address = req.params.address;

    const dex = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`
    );

    const dexData = await dex.json();

    if (!dexData.pairs || dexData.pairs.length === 0) {
      return res.json({ error: "Token not found" });
    }

    const pair = dexData.pairs[0];
    const liquidity = pair.liquidity?.usd || 0;

    let risk = 0;
    if (liquidity < 5000) risk += 40;
    if ((pair.fdv || 0) < 100000) risk += 30;
    if ((pair.priceChange?.h1 || 0) < -20) risk += 30;

    res.json({
      token: address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      liquidity: Math.floor(liquidity),
      fdv: Math.floor(pair.fdv || 0),
      priceUsd: pair.priceUsd,
      volume24h: pair.volume?.h24 || 0,
      dex: pair.dexId,
      risk,
      status: risk > 60 ? "HIGH RISK" : "SAFE"
    });
  } catch {
    res.json({ error: "scan failed" });
  }
});

// ================= LIVE NEW PAIRS (STABLE) =================
app.get("/newpairs", async (req, res) => {
  try {
    const r = await fetch(
      "https://api.dexscreener.com/latest/dex/search/?q=SOL"
    );

    const d = await r.json();

    if (!d.pairs) return res.json([]);

    const list = d.pairs
      .filter(p => p.chainId === "solana")
      .slice(0, 20)
      .map(p => ({
        token: p.baseToken.address,
        name: p.baseToken.name,
        symbol: p.baseToken.symbol,
        liquidity: Math.floo
