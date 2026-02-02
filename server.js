const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Solana Backend Alive 🚀");
});

app.get("/scan/:address", (req, res) => {

  const token = req.params.address;

  res.json({
    token,
    name: "ELEMENTARDIO",
    symbol: "AUTARDIO",
    liquidity: 61817,
    fdv: 500112,
    priceUsd: "0.0005001",
    volume24h: 907431,
    dex: "pumpswap",
    risk: 0,
    status: "SAFE"
  });

});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
