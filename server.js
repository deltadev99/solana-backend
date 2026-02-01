const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solana backend online 🚀");
});

app.get("/scan/:address", async (req, res) => {
  const address = req.params.address;

  // dummy data dulu (nanti bisa upgrade real Solana API)
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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
