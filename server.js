const express = require("express");
const cors = require("cors");

console.log("🚀 STABLE SNIPER BACKEND");

const app = express();
app.use(cors());

// ================= MOCK GENERATOR =================

let PAIRS = [];

function generatePairs() {
  PAIRS = [];

  for (let i = 0; i < 40; i++) {
    PAIRS.push({
      token: Math.random().toString(36).slice(2),
      name: "MEME-" + Math.floor(Math.random() * 9999),
      symbol: "SOL",
      liquidity: Math.floor(Math.random() * 150000),
      fdv: Math.floor(Math.random() * 500000),
      dev: Math.random().toFixed(2), // %
      created: Date.now() - Math.floor(Math.random() * 10 * 60 * 1000) // last 10 min
    });
  }
}

// refresh every 5 seconds
generatePairs();
setInterval(generatePairs, 5000);

// ================= FILTER ENGINE =================

app.get("/new-pairs", (req, res) => {

  let {
    minLiquidity = 0,
    maxFDV = 999999999,
    maxAge = 999999,
    maxDev = 1
  } = req.query;

  minLiquidity = Number(minLiquidity);
  maxFDV = Number(maxFDV);
  maxAge = Number(maxAge) * 60 * 1000; // minutes
  maxDev = Number(maxDev);

  const now = Date.now();

  const filtered = PAIRS.filter(p =>
    p.liquidity >= minLiquidity &&
    p.fdv <= maxFDV &&
    (now - p.created) <= maxAge &&
    Number(p.dev) <= maxDev
  );

  res.json(filtered);
});

// ================= ROOT =================

app.get("/", (req,res)=>{
  res.send("🔥 Stable Sniper Backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
