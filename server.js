const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

const app = express();
app.use(cors());

app.get("/new-pairs", async (req,res)=>{

try{

const r = await fetch("https://api.dexscreener.com/latest/dex/search/?q=pump.fun");
const j = await r.json();

const out = j.pairs.slice(0,20).map(p=>({

token: p.baseToken?.address || "",

name:
p.baseToken?.name ||
p.baseToken?.symbol ||
"UNKNOWN",

symbol: p.baseToken?.symbol || "?",

liquidity: Math.floor(p.liquidity?.usd || 0),

fdv: Math.floor(p.fdv || 0),

dex: p.dexId,

created: Date.now()

}));

res.json(out);

}catch(e){
res.json([{error:e.toString()}]);
}

});

app.get("/",(req,res)=>{
res.send("Backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
