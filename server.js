const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/scan/:token", async (req, res) => {

  res.json({
    liquidity: Math.floor(Math.random() * 60000),
    holders: Math.floor(Math.random() * 4000),
    dev: (Math.random() * 6).toFixed(2),
    mint: Math.random() > 0.5,
    freeze: Math.random() > 0.5,
    risk: Math.floor(Math.random() * 100),
  });

});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
