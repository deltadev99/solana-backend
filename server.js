const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

console.log("🚀 REAL SERVER LOADED");

const app = express();
app.use(cors());

app.get("/new-pairs", async (req,res)=>{

try{

const r = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana",{
headers:{
"user-agent":"Mozilla/5.0"
}
});

const text = await r.text();

if(text.startsWith("<")) return res.json([]);

const j = JSON.parse(text);

const out = (j.pairs||[])
.filter(p=>p.liquidity?.usd>2000)
.slice(0,30)
.map(p=>({
token:p.baseToken.address,
name:p.baseToken.name||p.baseToken.symbol||"UNKNOWN",
symbol:p.baseToken.symbol||"",
liquidity:Math.floor(p.liquidity.usd),
fdv:Math.floor(p.fdv||0),
dex:p.dexId,
created:p.pairCreatedAt||Date.now()
}));

res.json(out);

}catch(e){
res.json([{error:e.toString()}]);
}

});

app.get("/",(req,res)=>{
res.send("Solana backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
