const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("Backend OK");
});

app.get("/scan/:address", (req,res)=>{
  res.json({
    token:req.params.address,
    liquidity:26690,
    holders:1800,
    dev:0.23,
    mint:"YES",
    freeze:"NO",
    risk:"23 SAFE"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", ()=>{
  console.log("running on",PORT);
});
