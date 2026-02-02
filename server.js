const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

let newTokens = [];

function connectPump() {
  console.log("Connecting Pump.fun...");

  const ws = new WebSocket("wss://pumpportal.fun/api/data");

  ws.on("open", () => {
    console.log("Pump WS connected");

    ws.send(
      JSON.stringify({
        method: "subscribeNewToken"
      })
    );
  });

  ws.on("message", msg => {
    try {
      const d = JSON.parse(msg.toString());

      if (d.mint) {
        newTokens.unshift({
          token: d.mint,
          symbol: d.symbol || "NEW",
          liquidity: d.marketCapSol || 0,
          time: Date.now()
        });

        newTokens = newTokens.slice(0, 50);

        console.log("NEW:", d.mint);
      }
    } catch (e) {
      console.log("parse error");
    }
  });

  ws.on("close", () => {
    console.log("WS closed – reconnecting");
    setTimeout(connectPump, 3000);
  });

  ws.on("error", err => {
    console.log("WS error", err.message);
    ws.close();
  });
}

connectPump();

app.get("/", (req, res) => {
  res.send("Pump backend alive");
});

app.get("/newpairs", (req, res) => {
  res.json(newTokens);
});

app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
