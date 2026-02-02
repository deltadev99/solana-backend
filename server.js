const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

const app = express();
app.use(cors());

app.get("/new-pairs", async (req,res)=>{

try{

const r = await fetch("https://api.dexscreener.com/latest/dex/search/?q=pump");
const j = await r.json();

const out = j.pairs.slice(0,25).map(p=>{

const addr = p.baseToken?.address || "";

let name = p.baseToken?.name;
if(!name || name==="") name = p.baseToken?.symbol;
if(!name || name==="") name = addr.slice(0,6);

return {
token: addr,
name,
symbol: p.baseToken?.symbol || "",
liquidity: Math.floor(p.liquidity?.usd||0),
fdv: Math.floor(p.fdv||0),
dex: p.dexId,
created: Date.now()
};

});

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
