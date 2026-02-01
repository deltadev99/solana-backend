const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// root test
app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

// scan endpoint
app.get("/scan/:address", async (req, res) => {
  const address = req.params.address;

  res.json({
    token: address,
    liquidity: 26690,
    holders: 1800,
    dev: "0.23%",
    mint: "YES",
    freeze: "NO",
    risk: 23,
    status: "SAFE"
  });
});

// HARD FIX PORT FOR RAILWAY
app.listen(3001, () => {
  console.log("Server running on 3001");
});
