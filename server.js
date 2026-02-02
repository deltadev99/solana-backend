const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

const app = express();
app.use(cors());

let PAIRS = [];

function randomAddr(){
  return Math.random().toString(36).slice(2,12);
}

async function generate(){

  const name = "SOL-MEME-"+Math.floor(Math.random()*9999);

  PAIRS.unshift({
    token: randomAddr(),
    name,
    symbol:"SOL",
    liquidity: Math.floor(Math.random()*90000)+20000,
    fdv: Math.floor(Math.random()*500000)+30000,
    dex:"pump",
    created: Date.now()
  });

  if(PAIRS.length>25) PAIRS.pop();
}

setInterval(generate,2500);

// scan

app.get("/scan/:token",async(req,res)=>{
  res.json({
    token:req.params.token,
    name:"UNKNOWN",
    liquidity:Math.floor(Math.random()*80000),
    risk:Math.floor(Math.random()*40),
    status:"SAFE"
  });
});

// pairs

app.get("/new-pairs",(req,res)=>{
  res.json(PAIRS);
});

app.get("/",(req,res)=>{
  res.send("Solana Backend OK 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
