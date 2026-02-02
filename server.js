const express = require("express");
const cors = require("cors");

const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

const app = express();
app.use(cors());

const RPC = "https://api.mainnet-beta.solana.com";

async function rpc(method,params=[]){
  const r = await fetch(RPC,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({
      jsonrpc:"2.0",
      id:1,
      method,
      params
    })
  });

  const j = await r.json();
  return j.result;
}

// scan token

app.get("/scan/:mint",async(req,res)=>{

try{

const mint = req.params.mint;

const acc = await rpc("getAccountInfo",[mint,{encoding:"jsonParsed"}]);

if(!acc) return res.json({error:"not found"});

const supply = await rpc("getTokenSupply",[mint]);

res.json({
  token:mint,
  supply:supply?.value?.uiAmount || 0,
  decimals:supply?.value?.decimals || 0
});

}catch(e){
res.json({error:e.toString()});
}

});

// REAL NEW PAIRS (pump.fun via dex screener)

app.get("/new-pairs",async(req,res)=>{

try{

const r = await fetch("https://api.dexscreener.com/latest/dex/search/?q=pump");

const j = await r.json();

const out = j.pairs.slice(0,20).map(p=>({
  token:p.baseToken.address,
  name:p.baseToken.name,
  symbol:p.baseToken.symbol,
  liquidity:Math.floor(p.liquidity?.usd||0),
  fdv:Math.floor(p.fdv||0),
  dex:p.dexId,
  created:Date.now()
}));

res.json(out);

}catch(e){
res.json([]);
}

});

app.get("/",(req,res)=>{
res.send("Solana REAL backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
