const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Backend OK");
});

app.get("/scan/:address", (req, res) => {
  res.json({
    token: req.params.address,
    status: "SAFE"
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on", PORT);
});
