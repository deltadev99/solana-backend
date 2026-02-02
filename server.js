const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("🔥 SNIPER BACKEND RUNNING");

function randomPair(){
return{
token:Math.random().toString(36).slice(2),
name:"MEME-"+Math.floor(Math.random()*9999),
symbol:"SOL",
liquidity:Math.floor(Math.random()*150000),
fdv:Math.floor(Math.random()*500000),
dev:(Math.random()*0.8).toFixed(2),
created:Date.now()
};
}

let PAIRS=[];

setInterval(()=>{
PAIRS=[];
for(let i=0;i<30;i++) PAIRS.push(randomPair());
},4000);

app.get("/new-pairs",(req,res)=>{
res.json(PAIRS);
});

app.get("/scan",(req,res)=>{
const t=req.query.token||"";
res.json({
token:t,
name:"SCANNED-"+t.slice(0,5),
symbol:"SOL",
liquidity:Math.floor(Math.random()*100000),
fdv:Math.floor(Math.random()*300000),
dev:(Math.random()*0.6).toFixed(2),
risk:Math.floor(Math.random()*30)
});
});

app.get("/",(req,res)=>{
res.send("🔥 SNIPER BACKEND OK");
});

const PORT=process.env.PORT||8080;
app.listen(PORT,()=>console.log("Listening",PORT));
