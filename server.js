const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

console.log("🚀 BIRDEYE SERVER");

const app = express();
app.use(cors());

const KEY = "public";

app.get("/new-pairs", async (req,res)=>{

try{

const r = await fetch(
"https://public-api.birdeye.so/public/new_tokens?chain=solana&limit=25",
{
headers:{
"X-API-KEY":KEY
}
});

const j = await r.json();

const out = (j.data||[]).map(t=>({
token:t.address,
name:t.name,
symbol:t.symbol,
liquidity:t.liquidity||0,
fdv:t.marketCap||0,
dex:"birdeye",
created:Date.now()
}));

res.json(out);

}catch(e){
res.json([{error:e.toString()}]);
}

});

app.get("/",(req,res)=>{
res.send("Birdeye backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
