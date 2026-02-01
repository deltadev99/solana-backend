const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/scan/:address", async (req, res) => {
  const address = req.params.address;

  res.json({
    token: address,
    liquidity: 26690,
    holders: 1800,
    dev: 0.23,
    mint: "YES",
    freeze: "NO",
    risk: "23 (SAFE)"
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
