const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let PAIRS = [];

// health check
app.get("/", (req, res) => {
  res.send("SOLANA BACKEND OK 🚀");
});

// API new pairs
app.get("/new-pairs", (req, res) => {
  res.json(PAIRS);
});

// dummy generator (biar frontend pasti isi)
setInterval(() => {
  PAIRS.unshift({
    token: Math.random().toString(36).slice(2),
    name: "MEME-" + Math.floor(Math.random() * 9999),
    symbol: "SOL",
    liquidity: Math.floor(Math.random() * 100000),
    fdv: Math.floor(Math.random() * 500000),
    dex: "pump",
    created: Date.now(),
  });

  if (PAIRS.length > 25) PAIRS.pop();
}, 4000);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Listening on", PORT);
});
