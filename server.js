const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let PAIRS = [];

app.get("/", (req,res)=>{
  res.send("SOLANA BACKEND OK");
});

// NEW PAIRS ENDPOINT
app.get("/new-pairs",(req,res)=>{
  res.json(PAIRS);
});

// MOCK GENERATOR (sementara)
setInterval(()=>{
  PAIRS.unshift({
    token: Math.random().toString(36).substring(2),
    name: "MEME-" + Math.floor(Math.random()*9999),
    symbol: "SOL",
    liquidity: Math.floor(Math.random()*50000),
    fdv: Math.floor(Math.random()*100000),
    dex: "pump",
    created: Date.now()
  });

  if(PAIRS.length > 30) PAIRS.pop();

},5000);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
  console.log("Listening on",PORT);
});
