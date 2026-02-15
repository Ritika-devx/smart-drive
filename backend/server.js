const express = require("express");
const db = require("../db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" Smart Drive Server Running");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
