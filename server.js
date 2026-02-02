const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Solana backend running");
});

app.get("/scan/:address", async (req, res) => {
  const address = req.params.address;

  res.json({
    token: address,
    name: "ELEMENTARDIO",
    symbol: "AUTARDIO",
    liquidity: 61817,
    fdv: 500112,
    dex: "pumpswap",
    risk: 0,
    status: "SAFE"
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on " + PORT);
});
