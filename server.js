const express = require("express");
const app = express();

app.get("/", (req,res)=>{
  res.send("Backend OK");
});

app.get("/scan/:token",(req,res)=>{
  res.json({
    token:req.params.token,
    status:"SAFE"
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT,"0.0.0.0",()=>{
  console.log("Listening on",PORT);
});
