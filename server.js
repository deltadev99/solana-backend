const express = require("express");
const cors = require("cors");
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a));

console.log("🚀 JUPITER SERVER");

const app = express();
app.use(cors());

app.get("/new-pairs",async(req,res)=>{

try{

const r = await fetch("https://token.jup.ag/all");
const list = await r.json();

const now = Date.now();

const out = Object.values(list)
.slice(0,30)
.map(t=>({
token:t.address,
name:t.name,
symbol:t.symbol,
liquidity:0,
fdv:0,
dex:"jupiter",
created:now
}));

res.json(out);

}catch(e){
res.json([{error:e.toString()}]);
}

});

app.get("/",(req,res)=>{
res.send("Jupiter backend OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>console.log("Listening",PORT));
