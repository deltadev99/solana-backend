const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

const app = express();
app.use(cors());

app.get("/new-pairs", async (req,res)=>{

try{

const r = await fetch("https://api.dexscreener.com/latest/dex/search/?q=pump.fun");
const j = await r.json();

const pairs = (j.pairs || []).slice(0,25).map(p=>{

const addr = p.baseToken?.address || "";

return {
token: addr,
name: p.baseToken?.name || p.baseToken?.symbol || addr.slice(0,6),
symbol: p.baseToken?.symbol || "",
liquidity: Math.floor(p.liquidity?.usd || 0),
fdv: Math.floor(p.fdv || 0),
dex: p.dexId,
created: Date.now()
};

});

res.json(pairs);

}catch(e){
res.json([{error:e.toString()}]);
}

});

app.get("/",(req,res)=>{
res.send("REAL backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
