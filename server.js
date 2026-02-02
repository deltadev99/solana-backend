const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

let newTokens = [];

const ws = new WebSocket("wss://pumpportal.fun/api/data");

ws.on("open", () => {
  ws.send(JSON.stringify({ method: "subscribeNewToken" }));
});

ws.on("message", msg => {
  try {
    const d = JSON.parse(msg.toString());

    if (d.mint) {
      newTokens.unshift({
        token: d.mint,
        symbol: d.symbol || "NEW",
        liquidity: d.marketCapSol || 0
      });

      newTokens = newTokens.slice(0, 20);
    }
  } catch {}
});

app.get("/newpairs", (req, res) => {
  res.json(newTokens);
});

app.listen(PORT, () => console.log("Pump.fun live on", PORT));
